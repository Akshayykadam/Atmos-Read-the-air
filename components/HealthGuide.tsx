import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { GenZTheme } from '../constants/Theme';

interface HealthGuideProps {
    aqi: number;
}

export const HealthGuide = React.memo(function HealthGuide({ aqi }: HealthGuideProps) {
    const { t } = useTranslation();

    const getRecommendations = (aqi: number) => {
        if (aqi <= 50) {
            return [
                { icon: 'bicycle-outline', label: 'healthGuide.good.outdoor' },
                { icon: 'home-outline', label: 'healthGuide.good.ventilate' },
            ];
        }
        if (aqi <= 100) {
            return [
                { icon: 'walk-outline', label: 'healthGuide.moderate.outdoor' },
                { icon: 'window-outline', label: 'healthGuide.moderate.windows' },
            ];
        }
        if (aqi <= 150) {
            return [
                { icon: 'fitness-outline', label: 'healthGuide.poor.outdoor' },
                { icon: 'medical-outline', label: 'healthGuide.poor.mask' },
            ];
        }
        return [
            { icon: 'warning-outline', label: 'healthGuide.severe.outdoor' },
            { icon: 'cube-outline', label: 'healthGuide.severe.purifier' },
            { icon: 'medkit-outline', label: 'healthGuide.severe.mask' },
        ];
    };

    const tips = getRecommendations(aqi);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('healthGuide.title')}</Text>
            <View style={styles.grid}>
                {tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name={tip.icon as any} size={24} color={GenZTheme.colors.tertiary} />
                        </View>
                        <Text style={styles.tipText}>{t(tip.label)}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: GenZTheme.colors.tertiaryContainer, // Warm peach tone
        marginHorizontal: 16,
        marginTop: 32,
        borderRadius: GenZTheme.borderRadius.xl,
        padding: 32,
    },
    title: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
        marginBottom: 24,
    },
    grid: {
        gap: 16,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ffffff80',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    tipText: {
        flex: 1,
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 14,
        color: GenZTheme.text.primary,
        lineHeight: 20,
    },
});
