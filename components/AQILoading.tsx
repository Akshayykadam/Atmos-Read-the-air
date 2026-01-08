import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';

interface AQILoadingProps {
    message?: string;
}

export function AQILoading({ message }: AQILoadingProps) {
    const { t } = useTranslation();

    // Animated values for concentric circles
    const pulse1 = useRef(new Animated.Value(0)).current;
    const pulse2 = useRef(new Animated.Value(0)).current;
    const pulse3 = useRef(new Animated.Value(0)).current;
    const breathe = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulsing circles animation (like air quality waves)
        const createPulseAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        // Breathing animation for center circle
        const breatheAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(breathe, {
                    toValue: 1.2,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(breathe, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        const anim1 = createPulseAnimation(pulse1, 0);
        const anim2 = createPulseAnimation(pulse2, 600);
        const anim3 = createPulseAnimation(pulse3, 1200);

        anim1.start();
        anim2.start();
        anim3.start();
        breatheAnimation.start();

        return () => {
            anim1.stop();
            anim2.stop();
            anim3.stop();
            breatheAnimation.stop();
        };
    }, [pulse1, pulse2, pulse3, breathe]);

    const createPulseStyle = (animatedValue: Animated.Value, baseSize: number) => ({
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3],
                }),
            },
        ],
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 0],
        }),
    });

    return (
        <View style={styles.container}>
            <View style={styles.animationContainer}>
                {/* Pulsing rings - representing air quality waves */}
                <Animated.View
                    style={[styles.pulseRing, styles.ring1, createPulseStyle(pulse1, 60)]}
                />
                <Animated.View
                    style={[styles.pulseRing, styles.ring2, createPulseStyle(pulse2, 60)]}
                />
                <Animated.View
                    style={[styles.pulseRing, styles.ring3, createPulseStyle(pulse3, 60)]}
                />

                {/* Center breathing circle */}
                <Animated.View
                    style={[
                        styles.centerCircle,
                        {
                            transform: [{ scale: breathe }],
                        },
                    ]}
                >
                    <Text style={styles.aqiText}>AQI</Text>
                </Animated.View>
            </View>

            {/* Loading text */}
            <Text style={styles.loadingText}>
                {message || t('common.loading')}
            </Text>

            {/* Air quality indicators */}
            <View style={styles.indicatorRow}>
                <View style={[styles.indicator, { backgroundColor: '#00E400' }]} />
                <View style={[styles.indicator, { backgroundColor: '#FFFF00' }]} />
                <View style={[styles.indicator, { backgroundColor: '#FF7E00' }]} />
                <View style={[styles.indicator, { backgroundColor: '#FF0000' }]} />
                <View style={[styles.indicator, { backgroundColor: '#8F3F97' }]} />
                <View style={[styles.indicator, { backgroundColor: '#7E0023' }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
    },
    animationContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
    },
    ring1: {
        borderColor: '#00E400',
    },
    ring2: {
        borderColor: '#FFFF00',
    },
    ring3: {
        borderColor: '#FF7E00',
    },
    centerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2d2d44',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00E400',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    aqiText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    loadingText: {
        marginTop: 40,
        fontSize: 16,
        color: '#AAAAAA',
        letterSpacing: 1,
    },
    indicatorRow: {
        flexDirection: 'row',
        marginTop: 30,
        gap: 8,
    },
    indicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
