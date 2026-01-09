import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AQIData } from '../services/aqiApi';
import { getAQICategory, POLLUTANT_NAMES } from '../constants/aqiScale';
import { GenZTheme } from '../constants/Theme';

interface AQICardProps {
    data: AQIData;
    onAskAI?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const { width } = Dimensions.get('window');

export function AQICard({ data, onAskAI, onRefresh, isRefreshing }: AQICardProps) {
    const { t } = useTranslation();
    const category = getAQICategory(data.aqi);

    // Determine gradient based on AQI category (simplified mapping)
    const getGradient = (): [string, string, ...string[]] => {
        if (data.aqi <= 50) return GenZTheme.gradients.good as [string, string];
        if (data.aqi <= 100) return GenZTheme.gradients.moderate as [string, string];
        return GenZTheme.gradients.unhealthy as [string, string];
    };

    // Clean up city name - remove duplicates and shorten
    const getCleanCityName = (cityName: string): string => {
        // Remove "India" suffix and clean up duplicates
        const parts = cityName.split(',').map(p => p.trim());
        const uniqueParts = [...new Set(parts)];
        // Take first 2 unique parts max (e.g., "Shivajinagar, Pune")
        return uniqueParts.slice(0, 2).join(', ').replace(/, India$/, '');
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                <LinearGradient
                    colors={getGradient()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                >
                    <View style={styles.content}>
                        {/* Header: City & Status */}
                        <View style={styles.header}>
                            <View style={styles.cityInfo}>
                                <Text style={styles.city} numberOfLines={2}>
                                    {getCleanCityName(data.city)}
                                </Text>
                                <Text style={styles.status} numberOfLines={1}>{t(category.labelKey)}</Text>
                            </View>
                            <View style={styles.aqiBadge}>
                                <Text style={styles.aqiValue}>{data.aqi}</Text>
                                <Text style={styles.aqiLabel}>AQI</Text>
                            </View>
                        </View>

                        {/* Pollutant Info */}
                        <View style={styles.pollutantInfo}>
                            <Text style={styles.dominantLabel}>
                                {t('dashboard.dominantPollutant')}
                            </Text>
                            <Text style={styles.dominantValue}>
                                {POLLUTANT_NAMES[data.dominantPollutant] || data.dominantPollutant.toUpperCase()}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <Pressable
                                style={styles.refreshButton}
                                onPress={onRefresh}
                                disabled={isRefreshing}
                            >
                                <Ionicons
                                    name={isRefreshing ? "hourglass-outline" : "refresh-outline"}
                                    size={22}
                                    color="#FFFFFF"
                                />
                            </Pressable>

                            <Pressable
                                style={styles.aiButton}
                                onPress={onAskAI}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#F0F2F5']}
                                    style={styles.aiGradient}
                                >
                                    <Ionicons name="sparkles" size={18} color={GenZTheme.colors.primary} style={{ marginRight: 6 }} />
                                    <Text style={styles.aiText} numberOfLines={1} adjustsFontSizeToFit>
                                        {t('dashboard.askAi')}
                                    </Text>
                                </LinearGradient>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16.00,
        elevation: 24,
    },
    blurContainer: {
        borderRadius: 32,
    },
    cardGradient: {
        borderRadius: 32,
        padding: 24,
    },
    content: {
        gap: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cityInfo: {
        flex: 1,
        marginRight: 12,
    },
    city: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
        marginBottom: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        lineHeight: 34,
    },
    status: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.9)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    aqiBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 28,
        paddingHorizontal: 20,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    aqiValue: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        lineHeight: 40,
    },
    aqiLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: -2,
    },
    pollutantInfo: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 20,
        padding: 16,
    },
    dominantLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dominantValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
        height: 64, // Fixed height for alignment
    },
    refreshButton: {
        width: 64,
        height: 64,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    aiButton: {
        flex: 1,
        borderRadius: 24,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    aiGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        paddingHorizontal: 20,
    },
    aiText: {
        fontSize: 14,
        fontWeight: '700',
        color: GenZTheme.colors.primary,
        letterSpacing: 0.3,
        textAlign: 'center',
        flexShrink: 1,
    },
});
