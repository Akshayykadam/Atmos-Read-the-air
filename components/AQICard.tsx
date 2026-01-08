import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AQIData } from '../services/aqiApi';
import { getAQICategory, POLLUTANT_NAMES } from '../constants/aqiScale';

interface AQICardProps {
    data: AQIData;
    onAskAI?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export function AQICard({ data, onAskAI, onRefresh, isRefreshing }: AQICardProps) {
    const { t } = useTranslation();
    const category = getAQICategory(data.aqi);

    const getTimeAgo = () => {
        const now = Date.now();
        const diff = now - data.timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours} ${t(hours === 1 ? 'common.hour' : 'common.hours')} ${t('common.ago')}`;
        }
        return `${minutes} ${t('common.minutes')} ${t('common.ago')}`;
    };

    return (
        <View style={[styles.card, { backgroundColor: category.backgroundColor }]}>
            {/* AQI Value */}
            <View style={styles.aqiContainer}>
                <Text style={[styles.aqiValue, { color: category.color }]}>{data.aqi}</Text>
                <Text style={[styles.categoryLabel, { color: category.textColor }]}>
                    {t(category.labelKey)}
                </Text>
            </View>

            {/* City and Station */}
            <Text style={[styles.cityName, { color: category.textColor }]}>{data.city}</Text>

            {/* Health Message */}
            <Text style={[styles.healthMessage, { color: category.textColor }]}>
                {t(category.healthMessageKey)}
            </Text>

            {/* Dominant Pollutant */}
            <View style={styles.pollutantContainer}>
                <Text style={[styles.pollutantLabel, { color: category.textColor }]}>
                    {t('dashboard.dominantPollutant')}:
                </Text>
                <Text style={[styles.pollutantValue, { color: category.textColor }]}>
                    {POLLUTANT_NAMES[data.dominantPollutant] || data.dominantPollutant.toUpperCase()}
                </Text>
            </View>

            {/* Last Updated */}
            <View style={styles.footer}>
                <Text style={[styles.timestamp, { color: category.textColor }]}>
                    {t('common.lastUpdated')}: {getTimeAgo()}
                    {data.isCached && ` (${t('common.cached')})`}
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <Pressable
                    style={[styles.button, { backgroundColor: category.color }]}
                    onPress={onRefresh}
                    disabled={isRefreshing}
                >
                    <Text style={styles.buttonText}>
                        {isRefreshing ? t('common.loading') : t('dashboard.refresh')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.aiButton, { borderColor: category.color }]}
                    onPress={onAskAI}
                >
                    <Text style={[styles.buttonText, { color: category.color }]}>
                        {t('dashboard.askAi')}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    aqiContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    aqiValue: {
        fontSize: 120,
        fontWeight: '800',
        lineHeight: 130,
    },
    categoryLabel: {
        fontSize: 20,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cityName: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
    },
    healthMessage: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 16,
        opacity: 0.9,
    },
    pollutantContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    pollutantLabel: {
        fontSize: 14,
        opacity: 0.8,
    },
    pollutantValue: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    footer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    timestamp: {
        fontSize: 12,
        opacity: 0.7,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    aiButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
});
