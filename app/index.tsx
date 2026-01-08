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

import { AQICard } from '../components/AQICard';
import { LanguageSelector } from '../components/LanguageSelector';
import { OfflineBanner } from '../components/OfflineBanner';
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
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{t('dashboard.title')}</Text>
                    <Text style={styles.subtitle}>{t('dashboard.subtitle')}</Text>
                </View>
                <Pressable
                    style={styles.languageButton}
                    onPress={() => setShowLanguageSelector(true)}
                >
                    <Text style={styles.languageButtonText}>
                        {getLanguageDisplayName(i18n.language)}
                    </Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#1a1a2e"
                    />
                }
            >
                {/* Offline/Cached Banner */}
                <OfflineBanner
                    isOffline={isOffline}
                    isCached={aqiData?.isCached || false}
                    onRetry={handleRefresh}
                />

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
                        <AQICard
                            data={aqiData}
                            onAskAI={handleAskAI}
                            onRefresh={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        {/* Change City Button */}
                        <Pressable style={styles.changeCityButton} onPress={handleCityChange}>
                            <Text style={styles.changeCityIcon}>📍</Text>
                            <Text style={styles.changeCityText}>
                                {usingLocation
                                    ? t('dashboard.usingLocation')
                                    : t('dashboard.changeCity')}
                            </Text>
                            <Text style={styles.changeCityArrow}>→</Text>
                        </Pressable>

                        {/* Pollutants Grid */}
                        <View style={styles.pollutantsContainer}>
                            <Text style={styles.pollutantsTitle}>{t('dashboard.dominantPollutant')}</Text>
                            <View style={styles.pollutantsGrid}>
                                {Object.entries(aqiData.pollutants)
                                    .filter(([_, value]) => value !== undefined)
                                    .map(([key, value]) => (
                                        <View key={key} style={styles.pollutantItem}>
                                            <Text style={styles.pollutantValue}>{value}</Text>
                                            <Text style={styles.pollutantLabel}>
                                                {t(`pollutants.${key}`)}
                                            </Text>
                                        </View>
                                    ))}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#1a1a2e',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 14,
        color: '#AAAAAA',
        marginTop: 2,
    },
    languageButton: {
        backgroundColor: '#2d2d44',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    languageButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    contentContainer: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
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
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#1a1a2e',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    changeCityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    changeCityIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    changeCityText: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    changeCityArrow: {
        fontSize: 18,
        color: '#999',
    },
    pollutantsContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    pollutantsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pollutantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    pollutantItem: {
        width: '30%',
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    pollutantValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a2e',
    },
    pollutantLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
});
