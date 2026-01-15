import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
    Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';
import { AQICard } from '../components/AQICard';
import { LanguageSelector } from '../components/LanguageSelector';
import { AQILoading } from '../components/AQILoading';
import { WeatherCard } from '../components/WeatherCard';
import { HistoryGraph } from '../components/HistoryGraph';
import { PollutantGrid } from '../components/PollutantGrid';
import { ForecastCard } from '../components/ForecastCard';
import { HealthGuide } from '../components/HealthGuide';
import { ForecastGraph } from '../components/ForecastGraph';
import { MapCard } from '../components/MapCard';
import { StationPicker } from '../components/StationPicker';
import { AQIData, fetchAQIByCity, fetchAQIByCoordinates, fetchStationsInBounds, MapStation } from '../services/aqiApi';
import { getCurrentLocation, LocationError } from '../services/locationService';
import { getSelectedCity, setSelectedCity } from '../services/cacheService';
import { DEFAULT_CITY } from '../constants/config';
import { getLanguageDisplayName } from '../services/i18n';

export default function HomeScreen() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();

    const [aqiData, setAqiData] = useState<AQIData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    // Track current city to avoid reloading
    const [currentCityId, setCurrentCityId] = useState<string | null>(null);

    // We'll trust currentCityId instead of this for general location boolean
    // but can keep it for UI states if needed.
    const [usingLocation, setUsingLocation] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    // Station picker state
    const [nearbyStations, setNearbyStations] = useState<MapStation[]>([]);
    const [selectedStationUid, setSelectedStationUid] = useState<number | null>(null);

    const loadAQIData = useCallback(async (cityToLoad?: string) => {
        try {
            setError(null);
            setIsOffline(false);

            // If explicit city is provided, use it
            if (cityToLoad) {
                const data = await fetchAQIByCity(cityToLoad);
                setAqiData(data);
                setUsingLocation(false);
                return;
            }

            // Otherwise check cache/default logic (only if not passed)
            // But we will primarily drive this from useFocusEffect now

        } catch (err) {
            console.error('Error loading AQI:', err);
            setError(t('errors.apiFailed'));
            setIsOffline(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t]);

    // Main efficient data loader
    useFocusEffect(
        useCallback(() => {
            const checkAndLoad = async () => {
                const savedCity = await getSelectedCity();
                const effectiveCityId = savedCity || DEFAULT_CITY;

                // If we have data and the city hasn't changed, do nothing
                if (aqiData && effectiveCityId === currentCityId) {
                    return;
                }

                // New city or first load
                setIsLoading(true);

                try {
                    // Load the effective city
                    const data = await fetchAQIByCity(effectiveCityId);
                    setAqiData(data);
                    setCurrentCityId(effectiveCityId);
                    setUsingLocation(false);

                } catch (err) {
                    console.error('Error in checkAndLoad:', err);
                    setError(t('errors.apiFailed'));
                } finally {
                    setIsLoading(false);
                }
            };

            checkAndLoad();
        }, [currentCityId, aqiData]) // Dependencies: run if cityId tracking changes? No, deps of callback.
    );

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Force reload current city
        const city = currentCityId === 'GPS_LOCATION' ? null : (currentCityId || DEFAULT_CITY);

        try {
            if (currentCityId === 'GPS_LOCATION') {
                try {
                    const location = await getCurrentLocation();
                    const data = await fetchAQIByCoordinates(location.latitude, location.longitude, true);
                    setAqiData(data);
                } catch {
                    // Fallback
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


    // Fetch nearby stations when coordinates change
    useEffect(() => {
        const fetchNearby = async () => {
            if (!aqiData?.coordinates) {
                setNearbyStations([]);
                return;
            }
            const { latitude, longitude } = aqiData.coordinates;
            const delta = 0.2; // ~20km radius
            const stations = await fetchStationsInBounds(
                latitude - delta,
                longitude - delta,
                latitude + delta,
                longitude + delta
            );
            // Filter valid AQI and sort by name
            const valid = stations.filter(s => s.aqi !== '-').sort((a, b) => a.station.name.localeCompare(b.station.name));
            setNearbyStations(valid);
        };
        fetchNearby();
    }, [aqiData?.coordinates?.latitude, aqiData?.coordinates?.longitude]);

    // Handle station selection from picker
    const handleStationSelect = async (station: MapStation) => {
        setSelectedStationUid(station.uid);
        setIsLoading(true);
        try {
            // Fetch by UID using the @uid format
            const data = await fetchAQIByCity(`@${station.uid}`, true);
            setAqiData(data);
            setCurrentCityId(`@${station.uid}`);
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
            {/* Background Map Image - Placeholder removed
            <Image
                source={require('../assets/images/pune_map_bg.png')}
                style={styles.mapBackground}
                resizeMode="cover"
            />
            */}
            {/* Overlay Gradient for readability - Opaque to match Search Screen */}
            <LinearGradient
                colors={[GenZTheme.background, GenZTheme.background]}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={styles.title} numberOfLines={1}>
                        {aqiData?.city?.split(',')[0] || (currentCityId === 'GPS_LOCATION' ? 'Current Location' : currentCityId) || 'India'}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={2}>
                        {aqiData?.city || t('dashboard.subtitle')}
                    </Text>
                </View>
                <Pressable
                    style={styles.languageButton}
                    onPress={() => setShowLanguageSelector(true)}
                >
                    <BlurView intensity={20} tint="light" style={styles.langBlur}>
                        <Ionicons name="globe-outline" size={20} color={GenZTheme.text.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.languageButtonText}>
                            {getLanguageDisplayName(i18n.language)}
                        </Text>
                    </BlurView>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={GenZTheme.colors.primary}
                    />
                }
            >
                {/* Loading State */}
                {isLoading && (
                    <AQILoading message={t('common.loading')} />
                )}

                {/* Error State */}
                {error && !aqiData && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorEmoji}>😔</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <Pressable style={styles.retryButton} onPress={handleRefresh}>
                            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
                        </Pressable>
                    </View>
                )}

                {/* AQI Card */}
                {aqiData && (
                    <>
                        {/* Change City Button (Floating style) */}
                        <Pressable style={styles.changeCityButton} onPress={handleCityChange}>
                            <BlurView intensity={30} tint="dark" style={styles.cityBlur}>
                                <Ionicons name="location-sharp" size={20} color={GenZTheme.colors.primary} style={{ marginRight: 12 }} />
                                <Text style={styles.changeCityText}>
                                    {usingLocation
                                        ? t('dashboard.usingLocation')
                                        : t('dashboard.changeCity')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={GenZTheme.text.secondary} />
                            </BlurView>
                        </Pressable>

                        {/* Station Picker for nearby stations */}
                        <StationPicker
                            stations={nearbyStations}
                            selectedUid={selectedStationUid}
                            onSelectStation={handleStationSelect}
                        />

                        <AQICard
                            data={aqiData}
                            onAskAI={handleAskAI}
                            onRefresh={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        {/* Weather Card */}
                        <WeatherCard data={aqiData.weather} />

                        {/* History Graph - Uses WAQI forecast data */}
                        <HistoryGraph
                            forecast={aqiData.forecast}
                            cityName={aqiData.city?.split(',')[0]}
                        />

                        {/* Pollutants Grid (New List Layout) */}
                        <PollutantGrid data={aqiData.pollutants} />

                        {aqiData.forecast?.pm25 && aqiData.forecast.pm25.length > 0 && (
                            <>
                                <ForecastCard forecast={aqiData.forecast} />
                                <ForecastGraph forecast={aqiData.forecast} />
                            </>
                        )}

                        {aqiData.coordinates && (
                            <MapCard
                                latitude={aqiData.coordinates.latitude}
                                longitude={aqiData.coordinates.longitude}
                                aqi={aqiData.aqi}
                                cityName={aqiData.city}
                            />
                        )}

                        <HealthGuide aqi={aqiData.aqi} />

                        <View style={{ height: 40 }} />
                    </>
                )}
            </ScrollView>

            {/* Language Selector Modal */}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#E0E0E0',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
        fontWeight: '500',
        opacity: 0.8,
    },
    languageButton: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    langBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    languageButtonText: {
        color: GenZTheme.colors.dark,
        fontSize: 14,
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 12,
        paddingBottom: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: GenZTheme.text.secondary,
    },
    errorContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    errorEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: GenZTheme.text.secondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: GenZTheme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    changeCityButton: {
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cityBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    changeCityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    changeCityText: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '700',
    },
    changeCityArrow: {
        fontSize: 18,
        color: GenZTheme.text.secondary,
    },
    // Legacy styles removed

    mapBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
});
