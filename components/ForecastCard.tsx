import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';
import { DailyForecast } from '../services/aqiApi';

interface ForecastCardProps {
    forecast: DailyForecast;
}

export function ForecastCard({ forecast }: ForecastCardProps) {
    // Just use the available data - the API provides the most relevant forecast
    const dailyData = forecast.pm25 || [];

    const getDayLabel = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) return 'Today';

        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const getStatusColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>5-Day Forecast</Text>
                    <Text style={[styles.subtitle, { color: GenZTheme.colors.primary }]}>PM2.5</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {dailyData.slice(0, 5).map((item, index) => {
                        const color = getStatusColor(item.max);
                        return (
                            <View key={index} style={styles.dayItem}>
                                <Text style={styles.dayLabel}>{getDayLabel(item.day)}</Text>

                                <View style={[styles.indicatorRing, { borderColor: color, shadowColor: color }]}>
                                    <Text style={[styles.aqiValue, { color: color }]}>{item.max}</Text>
                                </View>

                                <Text style={styles.rangeText}>{item.min} - {item.max}</Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 16,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    glass: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
    },
    scrollContent: {
        gap: 12, // Tighter gap
        paddingRight: 20,
    },
    dayItem: {
        alignItems: 'center',
        // No background, clean look
        paddingHorizontal: 8,
        minWidth: 72,
    },
    dayLabel: {
        color: GenZTheme.text.secondary,
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 12,
        opacity: 0.8,
    },
    indicatorRing: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2, // Thinner border
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark fill
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
    },
    aqiValue: {
        fontSize: 15,
        fontWeight: '800',
    },
    rangeText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
    },
});
