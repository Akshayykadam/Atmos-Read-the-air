import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface AQILoadingProps {
    message?: string;
}

export function AQILoading({ message }: AQILoadingProps) {
    const { theme: GenZTheme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: GenZTheme.background }]}>
            <ActivityIndicator size="small" color={GenZTheme.colors.primary} />
            {message && <Text style={[styles.text, { color: GenZTheme.text.secondary }]}>{message.toUpperCase()}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    text: {
        fontSize: 11,
        marginTop: 20,
        letterSpacing: 2.5,
    },
});
