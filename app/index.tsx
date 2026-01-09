import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';
import { AQICard } from '../components/AQICard';
import { LanguageSelector } from '../components/LanguageSelector';
import { AQILoading } from '../components/AQILoading';
import { AQIData, fetchAQIByCity, fetchAQIByCoordinates } from '../services/aqiApi';
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
    const [usingLocation, setUsingLocation] = useState(false);
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);

    const loadAQIData = useCallback(async (forceRefresh = false) => {
        try {
            setError(null);
            setIsOffline(false);

            // Try to get location first
            try {
                const location = await getCurrentLocation();
                const data = await fetchAQIByCoordinates(
                    location.latitude,
                    location.longitude
                );
                setAqiData(data);
                setUsingLocation(true);
                return;
            } catch (locationError) {
                // Location failed, try saved city or default
                console.log('Location unavailable, using city:', locationError);
            }

            // Get saved city or use default
            const savedCity = await getSelectedCity();
            const cityToUse = savedCity || DEFAULT_CITY;

            const data = await fetchAQIByCity(cityToUse);
            setAqiData(data);
            setUsingLocation(false);
        } catch (err) {
            console.error('Error loading AQI:', err);
            setError(t('errors.apiFailed'));
            setIsOffline(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t]);

    useEffect(() => {
        loadAQIData();
    }, [loadAQIData]);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadAQIData(true);
    }, [loadAQIData]);

    const handleCityChange = () => {
        router.push('/search');
    };

    const handleAskAI = () => {
        if (aqiData) {
            router.push('/chat');
        }
    };

    return (
        <LinearGradient
            colors={GenZTheme.gradients.background as [string, string]}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>VAYU AI</Text>
                    <Text style={styles.subtitle}>{t('dashboard.subtitle')}</Text>
                </View>
                <Pressable
                    style={styles.languageButton}
                    onPress={() => setShowLanguageSelector(true)}
                >
                    <BlurView intensity={20} tint="light" style={styles.langBlur}>
                        <Ionicons name="globe-outline" size={20} color={GenZTheme.colors.dark} style={{ marginRight: 6 }} />
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
                            <BlurView intensity={40} tint="light" style={styles.cityBlur}>
                                <Ionicons name="location-sharp" size={20} color={GenZTheme.colors.primary} style={{ marginRight: 12 }} />
                                <Text style={styles.changeCityText}>
                                    {usingLocation
                                        ? t('dashboard.usingLocation')
                                        : t('dashboard.changeCity')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={GenZTheme.text.secondary} />
                            </BlurView>
                        </Pressable>

                        <AQICard
                            data={aqiData}
                            onAskAI={handleAskAI}
                            onRefresh={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        {/* Pollutants Grid (Glassmorphism Bento) */}
                        <View style={styles.pollutantsContainer}>
                            <Text style={styles.pollutantsTitle}>{t('dashboard.dominantPollutant')}</Text>
                            <View style={styles.pollutantsGrid}>
                                {Object.entries(aqiData.pollutants)
                                    .filter(([_, value]) => value !== undefined)
                                    .map(([key, value]) => {
                                        // Map pollutant keys to icons
                                        const getPollutantIcon = (pollutantKey: string) => {
                                            const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
                                                pm25: 'cloudy-outline',
                                                pm10: 'cloud-outline',
                                                o3: 'sunny-outline',
                                                no2: 'flame-outline',
                                                so2: 'warning-outline',
                                                co: 'car-outline',
                                            };
                                            return iconMap[pollutantKey] || 'ellipse-outline';
                                        };

                                        return (
                                            <View key={key} style={styles.pollutantItem}>
                                                <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
                                                <Ionicons
                                                    name={getPollutantIcon(key)}
                                                    size={24}
                                                    color={GenZTheme.colors.primary}
                                                    style={{ marginBottom: 8, opacity: 0.8 }}
                                                />
                                                <Text style={styles.pollutantValue}>{String(value)}</Text>
                                                <Text style={styles.pollutantLabel}>
                                                    {t(`pollutants.${key}`)}
                                                </Text>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Language Selector Modal */}
            <LanguageSelector
                visible={showLanguageSelector}
                onClose={() => setShowLanguageSelector(false)}
                currentLanguage={i18n.language}
            />
        </LinearGradient>
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
        fontSize: 32,
        fontWeight: '900',
        color: GenZTheme.colors.dark,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: GenZTheme.text.secondary,
        fontWeight: '600',
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
        marginBottom: 8,
    },
    cityBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    changeCityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    changeCityText: {
        flex: 1,
        fontSize: 16,
        color: GenZTheme.colors.dark,
        fontWeight: '700',
    },
    changeCityArrow: {
        fontSize: 18,
        color: GenZTheme.text.secondary,
    },
    pollutantsContainer: {
        marginHorizontal: 16,
        marginTop: 12,
    },
    pollutantsTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: 'rgba(0,0,0,0.5)',
        marginBottom: 12,
        marginLeft: 8,
        textTransform: 'uppercase',
    },
    pollutantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pollutantItem: {
        width: '48%', // 2-column layout
        aspectRatio: 1.1, // Slightly wider than tall
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.4)', // Slightly more opaque
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        padding: 12,
    },
    pollutantValue: {
        fontSize: 28, // Larger value
        fontWeight: '900',
        color: GenZTheme.colors.dark,
        marginBottom: 4,
    },
    pollutantLabel: {
        fontSize: 13, // Slightly larger label
        color: GenZTheme.colors.dark,
        fontWeight: '700',
        opacity: 0.6,
        textAlign: 'center',
        lineHeight: 18,
    },
});
