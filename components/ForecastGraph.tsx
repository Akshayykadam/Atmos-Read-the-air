import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LineChart } from 'react-native-gifted-charts';
import { GenZTheme } from '../constants/Theme';
import { DailyForecast } from '../services/aqiApi';

interface ForecastGraphProps {
    forecast: DailyForecast;
}

const { width } = Dimensions.get('window');

export function ForecastGraph({ forecast }: ForecastGraphProps) {
    // Just use the available data without filtering
    const data = (forecast.pm25 || [])
        .slice(0, 5)
        .map(item => ({
            value: item.max,
            label: new Date(item.day).toLocaleDateString('en-US', { weekday: 'short' }),
            dataPointText: item.max.toString(),
        }));

    if (data.length === 0) return null;

    // Calculate max value to add headroom for labels
    const maxDataValue = Math.max(...data.map(d => d.value));
    const yAxisMax = maxDataValue + (maxDataValue * 0.2); // Add 20% buffer

    return (
        <View style={styles.container}>
            <BlurView intensity={10} tint="dark" style={styles.glass}>
                <View style={styles.header}>
                    <Text style={styles.title}>Pollution Trend</Text>
                    {/* Tiny legend removed for minimalism */}
                </View>

                <LineChart
                    data={data}
                    maxValue={yAxisMax} // Explicit max value
                    width={width - 56} // Adjusted width
                    height={180}
                    thickness={3}
                    // Gradient Line
                    color={GenZTheme.colors.warning}
                    startFillColor={GenZTheme.colors.warning}
                    endFillColor={GenZTheme.colors.warning}
                    startOpacity={0.2}
                    endOpacity={0.0}
                    areaChart
                    curved
                    isAnimated
                    animateOnDataChange
                    animationDuration={800}

                    // Design details
                    hideRules
                    hideYAxisText
                    xAxisColor="transparent"
                    yAxisColor="transparent"

                    dataPointsColor={GenZTheme.colors.warning}
                    dataPointsRadius={4}

                    // Data Labels (Values on top of points)
                    textColor={GenZTheme.text.primary}
                    textFontSize={11}
                    textShiftY={-14}
                    textShiftX={-2}

                    // Axis Labels (Days)
                    xAxisLabelTextStyle={{
                        color: GenZTheme.text.secondary,
                        fontSize: 11,
                        fontWeight: '500'
                    }}

                    spacing={60}
                    initialSpacing={20}
                />
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
        paddingBottom: 10,
    },
    header: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        letterSpacing: -0.5,
    },
});
