import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';
import { AQICard } from '../components/AQICard';
import { LanguageSelector } from '../components/LanguageSelector';
import { AQILoading } from '../components/AQILoading';
import { PollutantGrid } from '../components/PollutantGrid';
import { HealthGuide } from '../components/HealthGuide';
import { StationPicker } from '../components/StationPicker';
import { WeatherDetailed } from '../components/WeatherDetailed';
import { AQIData, fetchAQIByCity, fetchAQIByCoordinates, fetchStationsInBounds, MapStation } from '../services/aqiApi';
import { OpenMeteoData, fetchOpenMeteoWeather } from '../services/weatherApi';
import { getCurrentLocation } from '../services/locationService';
import { getSelectedCity } from '../services/cacheService';
import { DEFAULT_CITY } from '../constants/config';

export default function HomeScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    const [aqiData, setAqiData] = useState<AQIData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentCityId, setCurrentCityId] = useState<string | null>(null);

    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [nearbyStations, setNearbyStations] = useState<MapStation[]>([]);
    const [selectedStationUid, setSelectedStationUid] = useState<number | null>(null);
    const isManualSelection = React.useRef(false);

    // Tab navigation: 'aqi' or 'weather'
    const [activeTab, setActiveTab] = useState<'aqi' | 'weather'>('aqi');

    const [weatherData, setWeatherData] = useState<OpenMeteoData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);

    // Main efficient data loader
    useFocusEffect(
        useCallback(() => {
            const checkAndLoad = async () => {
                if (isManualSelection.current) {
                    isManualSelection.current = false;
                    return;
                }
                const savedCity = await getSelectedCity();
                const isShowingGps = !savedCity && currentCityId === 'GPS_LOCATION';
                if (aqiData && (savedCity === currentCityId || isShowingGps)) {
                    return;
                }
                setIsLoading(true);

                try {
                    if (!savedCity) {
                        try {
                            const location = await getCurrentLocation();
                            const data = await fetchAQIByCoordinates(location.latitude, location.longitude);
                            setAqiData(data);
                            setCurrentCityId('GPS_LOCATION');
                            return;
                        } catch {
                            console.log('Location unavailable, using default city');
                        }
                    }
                    const effectiveCityId = savedCity || DEFAULT_CITY;
                    const data = await fetchAQIByCity(effectiveCityId);
                    setAqiData(data);
                    setCurrentCityId(effectiveCityId);
                } catch (err) {
                    console.error('Error in checkAndLoad:', err);
                    setError(t('errors.apiFailed'));
                } finally {
                    setIsLoading(false);
                }
            };

            checkAndLoad();
        }, [currentCityId, aqiData])
    );

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        const city = currentCityId === 'GPS_LOCATION' ? null : (currentCityId || DEFAULT_CITY);
        try {
            if (currentCityId === 'GPS_LOCATION') {
                try {
                    const location = await getCurrentLocation();
                    const data = await fetchAQIByCoordinates(location.latitude, location.longitude, true);
                    setAqiData(data);
                } catch {
                    const data = await fetchAQIByCity(DEFAULT_CITY, true);
                    setAqiData(data);
                }
            } else {
                const data = await fetchAQIByCity(city!, true);
                setAqiData(data);
            }
        } catch (e) {
            setError(t('errors.apiFailed'));
        } finally {
            setIsRefreshing(false);
        }
    }, [currentCityId, t]);

    useEffect(() => {
        const fetchNearby = async () => {
            if (!aqiData?.coordinates) {
                setNearbyStations([]);
                return;
            }
            const { latitude, longitude } = aqiData.coordinates;
            const delta = 0.2;
            const stations = await fetchStationsInBounds(
                latitude - delta,
                longitude - delta,
                latitude + delta,
                longitude + delta
            );
            const valid = stations.filter(s => s.aqi !== '-').sort((a, b) => a.station.name.localeCompare(b.station.name));
            setNearbyStations(valid);
        };
        fetchNearby();
    }, [aqiData?.coordinates?.latitude, aqiData?.coordinates?.longitude]);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!aqiData?.coordinates) {
                setWeatherData(null);
                return;
            }
            setWeatherLoading(true);
            const { latitude, longitude } = aqiData.coordinates;
            const data = await fetchOpenMeteoWeather(latitude, longitude);
            setWeatherData(data);
            setWeatherLoading(false);
        };
        fetchWeather();
    }, [aqiData?.coordinates?.latitude, aqiData?.coordinates?.longitude]);

    const handleStationSelect = async (station: MapStation) => {
        isManualSelection.current = true;
        setSelectedStationUid(station.uid);
        setIsLoading(true);
        try {
            const data = await fetchAQIByCoordinates(station.lat, station.lon, true);
            data.city = station.station.name;
            setAqiData(data);
            setCurrentCityId(`coords_${station.lat}_${station.lon}`);
        } catch (err) {
            console.error('Station select error:', err);
            setError(t('errors.apiFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCityChange = () => {
        router.push('/search');
    };

    const handleAskAI = () => {
        if (aqiData) {
            router.push('/chat');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header - Editorial Style */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title} numberOfLines={1}>
                        {(nearbyStations.find(s => s.uid === selectedStationUid)?.station.name.split(',')[0] ||
                            aqiData?.city ||
                            t('dashboard.detectingLocation')).toUpperCase()}
                    </Text>
                    <View style={styles.coordRow}>
                        <Ionicons name="location-outline" size={12} color={GenZTheme.text.secondary} />
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {aqiData?.coordinates ?
                                `${aqiData.coordinates.latitude.toFixed(4)}, ${aqiData.coordinates.longitude.toFixed(4)}` :
                                t('dashboard.subtitle')}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <Pressable style={styles.iconButton} onPress={handleCityChange}>
                        <Ionicons name="search-outline" size={20} color={GenZTheme.text.primary} />
                    </Pressable>
                    <Pressable style={styles.iconButton} onPress={() => setShowLanguageSelector(true)}>
                        <Ionicons name="language-outline" size={20} color={GenZTheme.text.primary} />
                    </Pressable>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={GenZTheme.colors.primary}
                    />
                }
            >
                {isLoading && <AQILoading message={t('common.loading')} />}

                {error && !aqiData && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorEmoji}>🍃</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <Pressable style={styles.retryButton} onPress={handleRefresh}>
                            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
                        </Pressable>
                    </View>
                )}

                {aqiData && (
                    <>
                        {/* Tab Navigation - Glass Editorial Style */}
                        <View style={styles.tabContainer}>
                            <Pressable
                                style={[styles.tabButton, activeTab === 'aqi' && styles.tabButtonActive]}
                                onPress={() => setActiveTab('aqi')}
                            >
                                <Text style={[styles.tabText, activeTab === 'aqi' && styles.tabTextActive]}>
                                    AIR QUALITY
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[styles.tabButton, activeTab === 'weather' && styles.tabButtonActive]}
                                onPress={() => setActiveTab('weather')}
                            >
                                <Text style={[styles.tabText, activeTab === 'weather' && styles.tabTextActive]}>
                                    WEATHER
                                </Text>
                            </Pressable>
                        </View>

                        {/* Station Picker */}
                        <StationPicker
                            stations={nearbyStations}
                            selectedUid={selectedStationUid}
                            onSelectStation={handleStationSelect}
                        />

                        {/* Tab Content */}
                        {activeTab === 'aqi' ? (
                            <View style={styles.editorialContent}>
                                <AQICard
                                    data={aqiData}
                                    onAskAI={handleAskAI}
                                    onRefresh={handleRefresh}
                                    isRefreshing={isRefreshing}
                                />
                                <PollutantGrid data={aqiData.pollutants} />
                                <HealthGuide aqi={aqiData.aqi} />
                            </View>
                        ) : (
                            <WeatherDetailed
                                weatherData={weatherData}
                                isLoading={weatherLoading}
                                cityName={aqiData.city?.split(',')[0]}
                            />
                        )}

                        <View style={{ height: 40 }} />
                    </>
                )}
            </ScrollView>

            <LanguageSelector
                visible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
                currentLanguage={i18n.language}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    title: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.primary,
        letterSpacing: 2,
    },
    coordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    subtitle: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: GenZTheme.cards.background,
        alignItems: 'center',
        justifyContent: 'center',
        ...GenZTheme.cards.shadow,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 32,
        backgroundColor: GenZTheme.cards.secondary,
        borderRadius: 100,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 100,
    },
    tabButtonActive: {
        backgroundColor: GenZTheme.cards.background,
        ...GenZTheme.cards.shadow,
    },
    tabText: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 11,
        color: GenZTheme.text.secondary,
        letterSpacing: 1,
    },
    tabTextActive: {
        color: GenZTheme.colors.primary,
        fontWeight: '700',
    },
    editorialContent: {
        // Allowing for breathing room and intentional asymmetry if needed
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 100,
        paddingHorizontal: 40,
    },
    errorEmoji: {
        fontSize: 48,
        marginBottom: 20,
    },
    errorText: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.secondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    retryButton: {
        backgroundColor: GenZTheme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 100,
    },
    retryButtonText: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: '#FFFFFF',
        fontSize: 14,
    },
});
