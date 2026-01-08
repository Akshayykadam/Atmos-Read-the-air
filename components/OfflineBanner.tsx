import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

interface OfflineBannerProps {
    isOffline: boolean;
    isCached: boolean;
    onRetry?: () => void;
}

export function OfflineBanner({ isOffline, isCached, onRetry }: OfflineBannerProps) {
    const { t } = useTranslation();

    if (!isOffline && !isCached) return null;

    return (
        <View style={[styles.container, isOffline ? styles.offline : styles.cached]}>
            <Text style={styles.icon}>{isOffline ? '📡' : '💾'}</Text>
            <Text style={styles.text}>
                {isOffline ? t('errors.noNetwork') : t('common.cached')}
            </Text>
            {onRetry && (
                <Pressable style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryText}>{t('common.retry')}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 10,
    },
    offline: {
        backgroundColor: '#FFEBEE',
    },
    cached: {
        backgroundColor: '#FFF3E0',
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    text: {
        flex: 1,
        fontSize: 13,
        color: '#333',
    },
    retryButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    retryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
});
