import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIChat } from '../components/AIChat';
import { AQILoading } from '../components/AQILoading';
import { AQIData, fetchAQIByCity } from '../services/aqiApi';
import { getSelectedCity } from '../services/cacheService';
import { DEFAULT_CITY } from '../constants/config';

export default function ChatScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [aqiData, setAqiData] = useState<AQIData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadAQI() {
            try {
                const savedCity = await getSelectedCity();
                const cityToUse = savedCity || DEFAULT_CITY;
                const data = await fetchAQIByCity(cityToUse);
                setAqiData(data);
            } catch (error) {
                console.error('Error loading AQI for chat:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAQI();
    }, []);

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Custom Header with Back Button */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>{t('chat.title')}</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            {isLoading ? (
                <AQILoading message={t('common.loading')} />
            ) : aqiData ? (
                <AIChat aqiData={aqiData} />
            ) : (
                <View style={styles.error}>
                    <Text style={styles.errorText}>{t('errors.apiFailed')}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1a1a2e',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2d2d44',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#F5F5F5',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
