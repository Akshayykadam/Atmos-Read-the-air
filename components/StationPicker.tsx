import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';
import { MapStation } from '../services/aqiApi';

interface StationPickerProps {
    stations: MapStation[];
    selectedUid: number | null;
    onSelectStation: (station: MapStation) => void;
}

export function StationPicker({ stations, selectedUid, onSelectStation }: StationPickerProps) {
    const getAQIColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    // Extract short name from full station name
    const getShortName = (fullName: string) => {
        // Station name is usually "Area, City, Country" - we want just the area
        const parts = fullName.split(',');
        return parts[0].trim();
    };

    if (stations.length <= 1) return null; // Don't show picker if only one station

    return (
        <View style={styles.container}>
            <BlurView intensity={15} tint="dark" style={styles.glass}>
                <Text style={styles.title}>Nearby Stations</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {stations.map((station) => {
                        const aqiVal = parseInt(station.aqi);
                        const isSelected = station.uid === selectedUid;
                        const color = isNaN(aqiVal) ? GenZTheme.text.secondary : getAQIColor(aqiVal);

                        return (
                            <Pressable
                                key={station.uid}
                                style={[
                                    styles.stationChip,
                                    isSelected && styles.stationChipSelected,
                                    isSelected && { borderColor: color }
                                ]}
                                onPress={() => onSelectStation(station)}
                            >
                                <View style={[styles.aqiBadge, { backgroundColor: color }]}>
                                    <Text style={styles.aqiText}>
                                        {isNaN(aqiVal) ? '-' : aqiVal}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.stationName,
                                        isSelected && { color: GenZTheme.text.primary }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {getShortName(station.station.name)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
    },
    glass: {
        paddingVertical: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: GenZTheme.text.secondary,
        marginBottom: 12,
        letterSpacing: 0.5,
        paddingHorizontal: 16,
    },
    scrollContent: {
        gap: 10,
        paddingHorizontal: 16,
    },
    stationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    stationChipSelected: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.2)',
    },
    aqiBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    aqiText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    stationName: {
        color: GenZTheme.text.secondary,
        fontSize: 13,
        fontWeight: '500',
        maxWidth: 150,
    },
});
