import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';
import { AQIData } from '../services/aqiApi';

interface AQICardProps {
    data: AQIData;
    onAskAI: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

const { width } = Dimensions.get('window');

// Helper to get helper text/color based on AQI
const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: GenZTheme.colors.aqi.good };
    if (aqi <= 100) return { label: 'Moderate', color: GenZTheme.colors.aqi.moderate };
    if (aqi <= 150) return { label: 'Poor', color: GenZTheme.colors.aqi.poor };
    if (aqi <= 200) return { label: 'Unhealthy', color: GenZTheme.colors.aqi.unhealthy };
    if (aqi <= 300) return { label: 'Severe', color: GenZTheme.colors.aqi.severe };
    return { label: 'Hazardous', color: GenZTheme.colors.aqi.hazardous };
};

const getAQIGradient = (aqi: number) => {
    if (aqi <= 50) return GenZTheme.gradients.good;
    if (aqi <= 100) return GenZTheme.gradients.moderate;
    if (aqi > 150) return GenZTheme.gradients.unhealthy; // Grouping poor/unhealthy/hazardous to red-ish for now or custom
    // Default for others
    return ['#FF9500', '#FF5E3A']; // Orange for poor
}

export function AQICard({ data, onAskAI, onRefresh, isRefreshing }: AQICardProps) {
    const status = getAQIStatus(data.aqi);
    const bgGradient = getAQIGradient(data.aqi);

    // Calculate pointer position (percentage)
    const maxAQI = 350; // Cap visual scale
    const pointerPosition = Math.min((data.aqi / maxAQI) * 100, 100);

    return (
        <View style={styles.container}>
            {/* Dynamic Background Gradient acting as a glow */}
            <LinearGradient
                colors={[status.color, 'transparent']}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={[StyleSheet.absoluteFill, { opacity: 0.15 }]}
            />

            <BlurView intensity={20} tint="dark" style={styles.glass}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>Live AQI</Text>
                        </View>
                        <Text style={styles.aqiValue}>{data.aqi}</Text>
                        <Text style={styles.aqiUnit}>AQI (India)</Text>
                    </View>

                    <View style={styles.statusSection}>
                        <Text style={styles.statusLabel}>Air Quality is</Text>
                        <View style={[styles.statusBadge, { backgroundColor: status.color + '40' }]}>
                            <Text style={[styles.statusText, { color: status.color }]}>
                                {status.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Main Pollutants Row */}
                <View style={styles.pollutantsRow}>
                    <Text style={styles.pollutantText}>
                        PM10 : <Text style={styles.pollutantValue}>{data.pollutants.pm10 || '--'} μg/m³</Text>
                    </Text>
                    <Text style={styles.pollutantText}>
                        PM2.5 : <Text style={styles.pollutantValue}>{data.pollutants.pm25 || '--'} μg/m³</Text>
                    </Text>
                </View>

                {/* Scale Bar */}
                <View style={styles.scaleContainer}>
                    <View style={styles.scaleLabels}>
                        <Text style={styles.scaleLabel}>Good</Text>
                        <Text style={styles.scaleLabel}>OK</Text>
                        <Text style={styles.scaleLabel}>Poor</Text>
                        <Text style={styles.scaleLabel}>Bad</Text>
                        <Text style={styles.scaleLabel}>Severe</Text>
                        <Text style={styles.scaleLabel}>Hazard</Text>
                    </View>

                    <View style={styles.scaleBar}>
                        <LinearGradient
                            colors={[
                                GenZTheme.colors.aqi.good,
                                GenZTheme.colors.aqi.moderate,
                                GenZTheme.colors.aqi.poor,
                                GenZTheme.colors.aqi.unhealthy,
                                GenZTheme.colors.aqi.severe,
                                GenZTheme.colors.aqi.hazardous
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBar}
                        />
                        {/* Pointer */}
                        <View style={[styles.pointer, { left: `${pointerPosition}%` }]}>
                            <View style={[styles.pointerDot, { backgroundColor: '#fff' }]} />
                        </View>
                    </View>

                    <View style={styles.scaleValues}>
                        <Text style={styles.scaleValue}>0</Text>
                        <Text style={styles.scaleValue}>50</Text>
                        <Text style={styles.scaleValue}>100</Text>
                        <Text style={styles.scaleValue}>150</Text>
                        <Text style={styles.scaleValue}>200</Text>
                        <Text style={styles.scaleValue}>300</Text>
                        <Text style={styles.scaleValue}>301+</Text>
                    </View>
                </View>

                {/* Last Updated Timestamp */}
                <View style={styles.timestampRow}>
                    <Ionicons name="time-outline" size={14} color={GenZTheme.text.secondary} />
                    <Text style={styles.timestampText}>
                        Station data from: {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {data.isCached && ' (cached)'}
                    </Text>
                </View>

                {/* Vayu Character - Placeholder removed until correct asset provided
                <Image
                   source={require('../assets/images/vayu_character.png')}
                   style={styles.character}
                   resizeMode="contain"
                />
                */}

            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 32,
        overflow: 'hidden',
        marginHorizontal: 16,
        backgroundColor: 'rgba(43, 49, 56, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        minHeight: 320,
    },
    glass: {
        flex: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5E3A',
        marginRight: 6,
    },
    liveText: {
        color: GenZTheme.text.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
    aqiValue: {
        fontSize: 100,
        fontWeight: '800',
        color: GenZTheme.colors.aqi.poor, // Dynamic color usually, but keeping orange/status color
        lineHeight: 100,
        marginLeft: -4,
    },
    aqiUnit: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
        marginTop: 0,
        fontWeight: '600',
    },
    statusSection: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    statusLabel: {
        color: GenZTheme.text.secondary,
        fontSize: 14,
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '700',
    },
    pollutantsRow: {
        flexDirection: 'row',
        marginTop: 32,
        gap: 24,
    },
    pollutantText: {
        color: GenZTheme.text.secondary,
        fontSize: 14,
        fontWeight: '700',
    },
    pollutantValue: {
        color: GenZTheme.text.primary,
        fontWeight: '600',
    },
    scaleContainer: {
        marginTop: 40,
        position: 'relative',
        zIndex: 2, // Behind character? No, character is separate
    },
    scaleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    scaleLabel: {
        fontSize: 10,
        color: GenZTheme.text.secondary,
        width: 40,
        textAlign: 'center',
    },
    scaleBar: {
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
    },
    gradientBar: {
        flex: 1,
        borderRadius: 3,
    },
    scaleValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    scaleValue: {
        fontSize: 10,
        color: GenZTheme.text.secondary,
        width: 30, // Approximate width to center
        textAlign: 'center',
    },
    pointer: {
        position: 'absolute',
        top: -5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginLeft: -8, // Center it on the position
    },
    pointerDot: {
        flex: 1,
        borderRadius: 8,
    },
    character: {
        position: 'absolute',
        bottom: 0,
        right: '30%', // Position it roughly in the center-right like the design
        width: 140,
        height: 180,
        zIndex: 10, // On top of everything
    },
    timestampRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 6,
    },
    timestampText: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
});
