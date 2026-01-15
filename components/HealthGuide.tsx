import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GenZTheme } from '../constants/Theme';

interface HealthGuideProps {
    aqi: number;
}

export function HealthGuide({ aqi }: HealthGuideProps) {
    const getRecommendations = (aqi: number) => {
        if (aqi <= 50) {
            return [
                { icon: 'bicycle', label: 'Great for Outdoor Activities', color: GenZTheme.colors.aqi.good },
                { icon: 'home', label: 'Ventilate your home', color: GenZTheme.colors.aqi.good },
            ];
        }
        if (aqi <= 100) {
            return [
                { icon: 'walk', label: 'Sensitive groups should reduce outdoor exercise', color: GenZTheme.colors.aqi.moderate },
                { icon: 'window-closed', label: 'Close windows if sensitive', color: GenZTheme.colors.aqi.moderate },
            ];
        }
        if (aqi <= 150) {
            return [
                { icon: 'fitness', label: 'Reduce prolonged outdoor exertion', color: GenZTheme.colors.aqi.poor },
                { icon: 'medical', label: 'Sensitive groups: wear a mask', color: GenZTheme.colors.aqi.poor },
            ];
        }
        return [
            { icon: 'warning', label: 'Avoid all outdoor activities', color: GenZTheme.colors.aqi.severe },
            { icon: 'cube', label: 'Run Air Purifier', color: GenZTheme.colors.aqi.severe },
            { icon: 'medkit', label: 'Wear N95 Mask outdoors', color: GenZTheme.colors.aqi.severe },
        ];
    };

    const tips = getRecommendations(aqi);

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <Text style={styles.title}>Health Guide</Text>

                <View style={styles.grid}>
                    {tips.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <View style={[styles.iconBox, { backgroundColor: tip.color + '20' }]}>
                                <Ionicons name={tip.icon as any} size={24} color={tip.color} />
                            </View>
                            <Text style={styles.tipText}>{tip.label}</Text>
                        </View>
                    ))}
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
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
    },
    glass: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        marginBottom: 16,
    },
    grid: {
        gap: 16,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    tipText: {
        flex: 1,
        color: GenZTheme.text.primary,
        fontSize: 14,
        fontWeight: '500',
    },
});
