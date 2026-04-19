import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../constants/Theme';
import { PollutantData } from '../services/aqiApi';

interface PollutantGridProps {
    data: PollutantData;
}

export const PollutantGrid = React.memo(function PollutantGrid({ data }: PollutantGridProps) {
    const { t } = useTranslation();
    const { theme: GenZTheme } = useTheme();
    const styles = React.useMemo(() => getStyles(GenZTheme), [GenZTheme]);

    const pollutants = [
        { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', icon: 'leaf-outline' },
        { key: 'pm10', label: 'PM10', unit: 'μg/m³', icon: 'analytics-outline' },
        { key: 'o3', label: 'O₃', unit: 'ppb', icon: 'sunny-outline' },
        { key: 'no2', label: 'NO₂', unit: 'ppb', icon: 'flash-outline' },
        { key: 'so2', label: 'SO₂', unit: 'ppb', icon: 'cloud-outline' },
        { key: 'co', label: 'CO', unit: 'ppm', icon: 'skull-outline' },
    ];

    const renderPollutant = (pollutant: typeof pollutants[0]) => {
        const val = data?.[pollutant.key as keyof PollutantData];
        if (val === undefined) return null;

        return (
            <View key={pollutant.key} style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={pollutant.icon as any} size={16} color={GenZTheme.colors.primary} />
                    </View>
                    <Text style={styles.label}>{pollutant.label}</Text>
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.value}>{Math.round(val as number)}</Text>
                    <Text style={styles.unit}>{pollutant.unit}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('dashboard.majorPollutants')}</Text>
            <View style={styles.grid}>
                {pollutants.map(renderPollutant)}
            </View>
        </View>
    );
});

const getStyles = (GenZTheme: ThemeType) => StyleSheet.create({
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
