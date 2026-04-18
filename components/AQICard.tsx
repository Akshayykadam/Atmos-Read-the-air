import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GenZTheme } from '../constants/Theme';
import { AQIData } from '../services/aqiApi';

interface AQICardProps {
    data: AQIData;
    onAskAI: () => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

const { width } = Dimensions.get('window');

// Helper to get helper text/color based on AQI using Pastel scale
const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: 'categories.good', color: GenZTheme.colors.aqi.good, bg: '#E2FFF8' };
    if (aqi <= 100) return { label: 'categories.moderate', color: GenZTheme.colors.aqi.moderate, bg: '#D5E3FF' };
    if (aqi <= 150) return { label: 'categories.poor', color: GenZTheme.colors.aqi.poor, bg: '#FED0B9' };
    if (aqi <= 200) return { label: 'categories.unhealthy', color: GenZTheme.colors.aqi.unhealthy, bg: '#FA746F40' };
    return { label: 'categories.severe', color: GenZTheme.colors.aqi.severe, bg: '#6E0A1220' };
};

export const AQICard = React.memo(function AQICard({ data, onAskAI, onRefresh, isRefreshing }: AQICardProps) {
    const { t } = useTranslation();
    const status = getAQIStatus(data.aqi);

    // Calculate pointer position (percentage)
    const maxAQI = 500; 
    const pointerPosition = Math.min((data.aqi / maxAQI) * 100, 100);

    return (
        <View style={styles.container}>
            {/* Header Section - Editorial Style */}
            <View style={styles.header}>
                <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                    <Text style={styles.statusLabel}>{t(status.label)}</Text>
                </View>
                <Text style={styles.timestamp}>
                    {t('dashboard.updated')}: {(() => {
                        const match = data.time.match(/T(\d{2}):(\d{2})/);
                        if (match) {
                            const hour = parseInt(match[1]);
                            const minute = match[2];
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            const hour12 = hour % 12 || 12;
                            return `${hour12}:${minute} ${ampm}`;
                        }
                        return data.time;
                    })()}
                </Text>
            </View>

            {/* AQI Display - Hero Typography */}
            <View style={styles.aqiContainer}>
                <Text style={styles.aqiValue}>{data.aqi}</Text>
                <View style={styles.aqiMeta}>
                    <Text style={styles.aqiUnit}>AQI</Text>
                    <Text style={styles.aqiDescription}>{t('dashboard.airQualityIs')}</Text>
                </View>
            </View>

            {/* Custom Air Quality Gauge - Pill Style */}
            <View style={styles.gaugeContainer}>
                <View style={styles.gaugeTrack}>
                   {/* Discrete but soft track sections */}
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.good, flex: 50 }]} />
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.moderate, flex: 50 }]} />
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.poor, flex: 50 }]} />
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.unhealthy, flex: 50 }]} />
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.severe, flex: 100 }]} />
                   <View style={[styles.trackSegment, { backgroundColor: GenZTheme.colors.aqi.hazardous, flex: 200 }]} />
                   
                   {/* Indicator Circle */}
                   <View style={[styles.indicator, { left: `${(data.aqi / 500) * 100}%` }]}>
                       <View style={styles.indicatorHalo} />
                       <View style={[styles.indicatorCore, { backgroundColor: status.color }]} />
                   </View>
                </View>
                <View style={styles.gaugeLabels}>
                    <Text style={styles.gaugeLabel}>0</Text>
                    <Text style={styles.gaugeLabel}>500</Text>
                </View>
            </View>

            {/* Tonal Layering for detailed pollutants */}
            <View style={styles.pollutantsContainer}>
                <View style={styles.pollutantModule}>
                    <Text style={styles.pollutantLabel}>PM2.5</Text>
                    <Text style={styles.pollutantValue}>{data.pollutants.pm25 || '--'}</Text>
                    <Text style={styles.pollutantUnit}>μg/m³</Text>
                </View>
                <View style={styles.pollutantModule}>
                    <Text style={styles.pollutantLabel}>PM10</Text>
                    <Text style={styles.pollutantValue}>{data.pollutants.pm10 || '--'}</Text>
                    <Text style={styles.pollutantUnit}>μg/m³</Text>
                </View>
                <View style={styles.pollutantModule}>
                    <Text style={styles.pollutantLabel}>O₃</Text>
                    <Text style={styles.pollutantValue}>{data.pollutants.o3 || '--'}</Text>
                    <Text style={styles.pollutantUnit}>ppb</Text>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: GenZTheme.cards.background,
        borderRadius: GenZTheme.borderRadius.xl,
        marginHorizontal: 16,
        padding: 32,
        ...GenZTheme.cards.shadow,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GenZTheme.cards.secondary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusLabel: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: GenZTheme.typography.label.fontSize,
        color: GenZTheme.text.primary,
        textTransform: 'uppercase',
    },
    timestamp: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
    aqiContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 32,
    },
    aqiValue: {
        fontFamily: GenZTheme.typography.display.fontFamily,
        fontSize: GenZTheme.typography.display.fontSize,
        color: GenZTheme.text.primary,
        letterSpacing: GenZTheme.typography.display.letterSpacing,
        lineHeight: 60,
    },
    aqiMeta: {
        marginLeft: 16,
    },
    aqiUnit: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.secondary,
        fontWeight: '700',
    },
    aqiDescription: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 14,
        color: GenZTheme.text.secondary,
    },
    gaugeContainer: {
        marginBottom: 40,
    },
    gaugeTrack: {
        height: 12,
        backgroundColor: GenZTheme.cards.secondary,
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'visible',
        position: 'relative',
    },
    trackSegment: {
        height: '100%',
        opacity: 0.3,
    },
    gaugeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    gaugeLabel: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
    },
    indicator: {
        position: 'absolute',
        top: -6,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
    },
    indicatorHalo: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    indicatorCore: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pollutantsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: GenZTheme.cards.secondary,
        borderRadius: GenZTheme.borderRadius.l,
        padding: 24,
    },
    pollutantModule: {
        alignItems: 'center',
    },
    pollutantLabel: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
        marginBottom: 4,
    },
    pollutantValue: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
        marginBottom: 2,
    },
    pollutantUnit: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 8,
        color: GenZTheme.text.secondary,
    },
});
