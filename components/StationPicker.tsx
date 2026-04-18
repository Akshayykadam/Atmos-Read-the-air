import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { GenZTheme } from '../constants/Theme';
import { MapStation } from '../services/aqiApi';

interface StationPickerProps {
    stations: MapStation[];
    selectedUid: number | null;
    onSelectStation: (station: MapStation) => void;
}

export const StationPicker = React.memo(function StationPicker({ stations, selectedUid, onSelectStation }: StationPickerProps) {
    const getAQIColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    const getShortName = (fullName: string) => {
        const parts = fullName.split(',');
        return parts[0].trim();
    };

    if (stations.length <= 1) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NEARBY STATIONS</Text>
            <FlatList
                data={stations}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={({ item: station }) => {
                    const aqiVal = parseInt(station.aqi);
                    const isSelected = station.uid === selectedUid;
                    const color = isNaN(aqiVal) ? GenZTheme.text.secondary : getAQIColor(aqiVal);

                    return (
                        <Pressable
                            style={[
                                styles.stationChip,
                                isSelected && styles.stationChipSelected,
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
                                    isSelected && { color: GenZTheme.colors.primary }
                                ]}
                                numberOfLines={1}
                            >
                                {getShortName(station.station.name)}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 24,
    },
    title: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
        letterSpacing: 1.5,
        marginBottom: 16,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingHorizontal: 24,
        gap: 12,
    },
    stationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GenZTheme.cards.background,
        borderRadius: 100,
        paddingLeft: 4,
        paddingRight: 16,
        paddingVertical: 4,
        ...GenZTheme.cards.shadow,
    },
    stationChipSelected: {
        backgroundColor: GenZTheme.colors.primaryContainer,
    },
    aqiBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    aqiText: {
        color: '#fff',
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 12,
    },
    stationName: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: GenZTheme.text.secondary,
        fontSize: 12,
        marginLeft: 8,
        maxWidth: 150,
    },
});
