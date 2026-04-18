import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GenZTheme } from '../constants/Theme';
import { PollutantData } from '../services/aqiApi';

interface PollutantGridProps {
    data: PollutantData;
}

interface PollutantCardProps {
    label: string;
    value: number | string;
    unit: string;
    icon: string;
}

function PollutantCard({ label, value, unit, icon }: PollutantCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon as any} size={16} color={GenZTheme.colors.primary} />
                </View>
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.unit}>{unit}</Text>
            </View>
        </View>
    );
}

export const PollutantGrid = React.memo(function PollutantGrid({ data }: PollutantGridProps) {
    const { t } = useTranslation();

    const pollutants = [
        { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', icon: 'leaf-outline' },
        { key: 'pm10', label: 'PM10', unit: 'μg/m³', icon: 'analytics-outline' },
        { key: 'o3', label: 'O₃', unit: 'ppb', icon: 'sunny-outline' },
        { key: 'no2', label: 'NO₂', unit: 'ppb', icon: 'flash-outline' },
        { key: 'so2', label: 'SO₂', unit: 'ppb', icon: 'cloud-outline' },
        { key: 'co', label: 'CO', unit: 'ppm', icon: 'skull-outline' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('dashboard.majorPollutants')}</Text>
            <View style={styles.grid}>
                {pollutants.map((p) => (
                    <PollutantCard
                        key={p.key}
                        label={p.label}
                        //@ts-ignore
                        value={data[p.key] || '--'}
                        unit={p.unit}
                        icon={p.icon}
                    />
                ))}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    title: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: GenZTheme.typography.title.fontSize,
        color: GenZTheme.text.primary,
        marginBottom: 20,
        marginLeft: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        backgroundColor: GenZTheme.cards.background, // surface-container-lowest
        width: '48%',
        padding: 20,
        borderRadius: GenZTheme.borderRadius.xl,
        ...GenZTheme.cards.shadow,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: GenZTheme.colors.primaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    label: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        fontFamily: GenZTheme.typography.headline.fontFamily,
        fontSize: 24,
        color: GenZTheme.text.primary,
        marginRight: 4,
    },
    unit: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
    },
});
