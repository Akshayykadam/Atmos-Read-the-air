import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';
import { WeatherData } from '../services/aqiApi';

interface WeatherCardProps {
    data: WeatherData;
    onRefresh?: () => void;
}

export function WeatherCard({ data }: WeatherCardProps) {
    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                {/* Top Section: Main Weather */}
                <View style={styles.mainSection}>
                    <View style={styles.tempGroup}>
                        <Ionicons name="moon" size={32} color="#4BA9FF" style={styles.weatherIcon} />
                        <Text style={styles.tempText}>
                            {data.temperature ? Math.round(data.temperature) : '--'}
                            <Text style={styles.degree}>°C</Text>
                        </Text>
                        <Text style={styles.conditionText}>Clear</Text>
                    </View>
                    <View style={styles.arrowButton}>
                        <Ionicons name="arrow-up" size={20} color={GenZTheme.text.primary} />
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Bottom Section: Details */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <Ionicons name="water-outline" size={18} color={GenZTheme.text.secondary} />
                        <Text style={styles.detailLabel}>Humidity</Text>
                        <Text style={styles.detailValue}>{data.humidity ? `${data.humidity}%` : '--'}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.detailItem}>
                        <Ionicons name="speedometer-outline" size={18} color={GenZTheme.text.secondary} />
                        <Text style={styles.detailLabel}>Wind</Text>
                        <Text style={styles.detailValue}>{data.wind ? `${data.wind} km/h` : '--'}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.detailItem}>
                        <Ionicons name="compass-outline" size={18} color={GenZTheme.text.secondary} />
                        <Text style={styles.detailLabel}>Pressure</Text>
                        <Text style={styles.detailValue}>{data.pressure ? `${Math.round(data.pressure)} hPa` : '--'}</Text>
                    </View>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 24,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        backgroundColor: 'rgba(34, 39, 44, 0.4)', // Base fallback
    },
    glass: {
        padding: 20,
    },
    mainSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    tempGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    weatherIcon: {
        shadowColor: '#4BA9FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    tempText: {
        fontSize: 36,
        fontWeight: '700',
        color: GenZTheme.text.primary,
    },
    degree: {
        fontSize: 20,
        fontWeight: '400',
        color: GenZTheme.text.secondary,
    },
    conditionText: {
        fontSize: 16,
        color: GenZTheme.text.primary,
        marginLeft: 8,
        fontWeight: '500',
    },
    arrowButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    detailLabel: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
        marginTop: 4,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: GenZTheme.text.primary,
    },
});
