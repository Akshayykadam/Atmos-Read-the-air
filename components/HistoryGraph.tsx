import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';
import { DailyForecast } from '../services/aqiApi';

interface HistoryGraphProps {
    forecast?: DailyForecast;
    cityName?: string;
}

const { width } = Dimensions.get('window');

export function HistoryGraph({ forecast, cityName }: HistoryGraphProps) {
    // Use PM2.5 forecast data as our "recent trend"
    const pm25Data = forecast?.pm25 || [];

    if (pm25Data.length === 0) {
        return (
            <View style={styles.container}>
                <BlurView intensity={20} tint="dark" style={styles.glass}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Recent AQI Trend</Text>
                        <Text style={styles.subtitle}>{cityName || 'PM2.5'}</Text>
                    </View>
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No trend data available</Text>
                    </View>
                </BlurView>
            </View>
        );
    }

    // Convert forecast data to chart format
    const chartData = pm25Data.slice(0, 7).map(item => ({
        value: item.avg || item.max, // Use average if available, otherwise max
        label: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
        min: item.min,
        max: item.max,
    }));

    // Calculate min/max from the data
    const allValues = chartData.map(d => d.value);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const minItem = chartData.find(d => d.value === minValue);
    const maxItem = chartData.find(d => d.value === maxValue);

    const getAQIColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    const chartMax = Math.ceil(maxValue * 1.2 / 50) * 50;

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Recent AQI Trend</Text>
                        <Text style={styles.subtitle}>{cityName || 'PM2.5 Data'}</Text>
                    </View>
                </View>

                {/* Min/Max Row */}
                <View style={styles.statsRow}>
                    {minItem && (
                        <View style={[styles.statBadge]}>
                            <View style={[styles.statValueBox, { backgroundColor: getAQIColor(minValue) }]}>
                                <Text style={styles.statValue}>{Math.round(minValue)}</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Best</Text>
                                <Text style={styles.statTime}>{minItem.label}</Text>
                            </View>
                        </View>
                    )}

                    {maxItem && (
                        <View style={[styles.statBadge]}>
                            <View style={[styles.statValueBox, { backgroundColor: getAQIColor(maxValue) }]}>
                                <Text style={styles.statValue}>{Math.round(maxValue)}</Text>
                            </View>
                            <View style={styles.statInfo}>
                                <Text style={styles.statLabel}>Worst</Text>
                                <Text style={styles.statTime}>{maxItem.label}</Text>
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.chartContainer}>
                    <LineChart
                        data={chartData}
                        areaChart
                        curved
                        curveType={0}
                        color1="#E95478"
                        startFillColor1="#E95478"
                        endFillColor1="rgba(233, 84, 120, 0.1)"
                        startOpacity={0.4}
                        endOpacity={0.0}
                        initialSpacing={10}
                        noOfSections={4}
                        yAxisTextStyle={{ color: GenZTheme.text.secondary, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: GenZTheme.text.secondary, fontSize: 10 }}
                        xAxisThickness={0}
                        yAxisThickness={0}
                        yAxisLabelSuffix=""
                        rulesColor="rgba(255,255,255,0.1)"
                        rulesType="solid"
                        maxValue={chartMax}
                        height={180}
                        width={width - 90}
                        spacing={45}
                        endSpacing={30}
                        hideDataPoints
                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            strokeDashArray: [2, 5],
                            pointerColor: 'lightgray',
                            radius: 4,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: (items: any) => {
                                const item = items[0];
                                return (
                                    <View
                                        style={{
                                            height: 80,
                                            width: 90,
                                            backgroundColor: '#282C3E',
                                            borderRadius: 8,
                                            justifyContent: 'center',
                                            paddingLeft: 12,
                                        }}>
                                        <Text style={{ color: 'lightgray', fontSize: 11 }}>{item.label}</Text>
                                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{Math.round(item.value)}</Text>
                                        <Text style={{ color: 'gray', fontSize: 10 }}>
                                            {item.min} - {item.max}
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                </View>

                <Text style={styles.footerNote}>
                    7-Day Trend • <Text style={{ color: GenZTheme.colors.primary }}>WAQI Data</Text>
                </Text>
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
        backgroundColor: 'rgba(34, 39, 44, 0.4)',
    },
    glass: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
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
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    noDataText: {
        color: GenZTheme.text.secondary,
        fontSize: 13,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    statBadge: {
        flex: 1,
        backgroundColor: '#1A1C1E',
        borderRadius: 12,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValueBox: {
        width: 48,
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    statInfo: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    statTime: {
        fontSize: 10,
        color: GenZTheme.text.secondary,
        marginTop: 2,
    },
    chartContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    footerNote: {
        textAlign: 'center',
        color: GenZTheme.text.secondary,
        fontSize: 12,
        marginTop: 12,
    },
});
