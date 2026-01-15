import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';

// Mock data to match the screenshot roughly
const hourlyData = [
    { value: 160, label: '10 PM' },
    { value: 165, label: '11 PM' },
    { value: 165, label: '12 AM' },
    { value: 170, label: '01 AM' },
    { value: 165, label: '02 AM' },
    { value: 168, label: '03 AM' },
    { value: 170, label: '04 AM' },
    { value: 172, label: '05 AM' },
    { value: 175, label: '06 AM' },
    { value: 182, label: '07 AM' },
    { value: 190, label: '08 AM' },
    { value: 205, label: '09 AM' }, // Max
    { value: 160, label: '10 AM' }, // Drop
    { value: 160, label: '11 AM' },
    { value: 155, label: '12 PM' },
    { value: 148, label: '01 PM' },
    { value: 140, label: '02 PM' },
    { value: 138, label: '03 PM' },
    { value: 135, label: '04 PM' },
    { value: 126, label: '05 PM' }, // Min
    { value: 126, label: '06 PM' },
    { value: 130, label: '07 PM' },
    { value: 148, label: '08 PM' },
    { value: 145, label: '09 PM' },
];

const { width } = Dimensions.get('window');

export function HistoryGraph() {
    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Historical Air Quality Data</Text>
                        <Text style={styles.subtitle}>Pune</Text>
                    </View>
                    {/* Min/Max Cards could go here or separate */}
                </View>

                {/* Min/Max Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statBadge, { borderColor: GenZTheme.colors.aqi.poor }]}>
                        <View style={[styles.statValueBox, { backgroundColor: GenZTheme.colors.aqi.poor }]}>
                            <Text style={styles.statValue}>126</Text>
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Min.</Text>
                            <Text style={styles.statTime}>at 6:04 PM</Text>
                        </View>
                    </View>

                    <View style={[styles.statBadge, { borderColor: GenZTheme.colors.aqi.severe }]}>
                        <View style={[styles.statValueBox, { backgroundColor: GenZTheme.colors.aqi.severe }]}>
                            <Text style={styles.statValue}>205</Text>
                        </View>
                        <View style={styles.statInfo}>
                            <Text style={styles.statLabel}>Max.</Text>
                            <Text style={styles.statTime}>at 9:04 AM</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <LineChart
                        data={hourlyData}
                        areaChart
                        curved
                        curveType={0} // Bezier
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
                        maxValue={220}
                        height={200}
                        width={width - 90} // Ensure it fits comfortably
                        spacing={40}
                        endSpacing={40}
                        hideDataPoints
                        pointerConfig={{
                            pointerStripUptoDataPoint: true,
                            pointerStripColor: 'lightgray',
                            pointerStripWidth: 2,
                            strokeDashArray: [2, 5],
                            pointerColor: 'lightgray',
                            radius: 4,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 120,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: (items: any) => {
                                const item = items[0];
                                return (
                                    <View
                                        style={{
                                            height: 100,
                                            width: 100,
                                            backgroundColor: '#282C3E',
                                            borderRadius: 4,
                                            justifyContent: 'center',
                                            paddingLeft: 16,
                                        }}>
                                        <Text style={{ color: 'lightgray', fontSize: 12 }}>{item.label}</Text>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.value}</Text>
                                    </View>
                                );
                            },
                        }}
                    />
                </View>

                <Text style={styles.footerNote}>Want air quality data? <Text style={{ color: GenZTheme.colors.primary }}>AQI Data</Text></Text>
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
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Or flex-start with gap
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
        borderLeftWidth: 0, // Design shows border maybe?
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
