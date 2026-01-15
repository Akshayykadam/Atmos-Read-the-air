import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';
import { PollutantData } from '../services/aqiApi';

interface PollutantGridProps {
    data: PollutantData;
}

// Helper to get color based on specific pollutant value (standard breakpoints)
// Simplified for this implementation to match screenshot aesthetics mostly.
const getPollutantColor = (key: string, value: number) => {
    // Rough logic:
    if (value < 50) return GenZTheme.colors.aqi.good;
    if (value < 100) return GenZTheme.colors.aqi.moderate;
    if (value < 150) return GenZTheme.colors.aqi.poor;
    return GenZTheme.colors.aqi.unhealthy;
};

const getPollutantName = (key: string) => {
    const map: Record<string, string> = {
        pm25: 'Particulate Matter\n(PM2.5)',
        pm10: 'Particulate Matter\n(PM10)',
        co: 'Carbon Monoxide\n(CO)',
        so2: 'Sulfur Dioxide\n(SO2)',
        no2: 'Nitrogen Dioxide\n(NO2)',
        o3: 'Ozone\n(O3)',
    };
    return map[key] || key.toUpperCase();
};

const getPollutantUnit = (key: string) => {
    if (['pm25', 'pm10'].includes(key)) return 'μg/m³';
    return 'ppb';
};

const getPollutantIcon = (key: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
        pm25: 'cloudy', // Using filled icons maybe? or outline
        pm10: 'cloud',
        o3: 'sunny',
        no2: 'flame',
        so2: 'water', // Acid rain?
        co: 'car',
    };
    return iconMap[key] || 'ellipse';
};

export function PollutantGrid({ data }: PollutantGridProps) {
    // Filter out undefined values
    const validPollutants = Object.entries(data).filter(([_, val]) => val !== undefined);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Major Air Pollutants</Text>
                <Text style={styles.subtitle}>Pune</Text>
            </View>

            <View style={styles.grid}>
                {validPollutants.map(([key, value]) => {
                    const color = getPollutantColor(key, value as number);

                    return (
                        <View key={key} style={styles.cardWrapper}>
                            <BlurView intensity={20} tint="dark" style={styles.card}>
                                <View style={[styles.colorBar, { backgroundColor: color }]} />
                                <View style={styles.cardContent}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name={getPollutantIcon(key)} size={24} color={GenZTheme.text.secondary} />
                                    </View>

                                    <View style={styles.infoContainer}>
                                        <Text style={styles.name} numberOfLines={2}>
                                            {getPollutantName(key)}
                                        </Text>
                                    </View>

                                    <View style={styles.valueContainer}>
                                        <Text style={styles.value}>{value}</Text>
                                        <Text style={styles.unit}>{getPollutantUnit(key)}</Text>
                                    </View>

                                    <Ionicons name="chevron-forward" size={16} color={GenZTheme.text.secondary} />
                                </View>
                            </BlurView>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    header: {
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: GenZTheme.colors.primary,
        fontWeight: '600',
    },
    grid: {
        gap: 12,
    },
    cardWrapper: {
        borderRadius: 16,
        overflow: 'hidden',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        backgroundColor: 'rgba(34, 39, 44, 0.4)',
    },
    card: {
        flexDirection: 'row',
        height: 70, // Fixed height for consistency
    },
    colorBar: {
        width: 4,
        // borderBottomRightRadius: 2, // Check if this was the duplicate or causing issue
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
        marginLeft: 0,
        height: '100%',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 12,
    },
    iconContainer: {
        width: 40,
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 13,
        color: GenZTheme.text.secondary,
        fontWeight: '500',
    },
    valueContainer: {
        alignItems: 'flex-end',
        marginRight: 8,
        minWidth: 50,
    },
    value: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
    },
    unit: {
        fontSize: 10,
        color: GenZTheme.text.secondary,
    },
});
