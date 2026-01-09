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
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    offline: {
        backgroundColor: '#FFF0F0',
    },
    cached: {
        backgroundColor: '#FFF8F0',
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
    },
    text: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    retryText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1A1A1A',
    },
});
