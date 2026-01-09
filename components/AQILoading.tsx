import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { GenZTheme } from '../constants/Theme';

interface AQILoadingProps {
    message?: string;
}

export function AQILoading({ message }: AQILoadingProps) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={GenZTheme.colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
