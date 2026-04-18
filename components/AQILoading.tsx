import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GenZTheme } from '../constants/Theme';

interface AQILoadingProps {
    message?: string;
}

export function AQILoading({ message }: AQILoadingProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" color={GenZTheme.colors.primary} />
            {message && <Text style={styles.text}>{message.toUpperCase()}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    text: {
        // Removed fontFamily to prevent hang if fonts haven't loaded yet
        fontSize: 10,
        color: GenZTheme.text.secondary,
        marginTop: 16,
        letterSpacing: 2,
    },
});
