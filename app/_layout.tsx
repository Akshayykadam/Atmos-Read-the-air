import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { 
    useFonts,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold 
} from '@expo-google-fonts/manrope';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold
} from '@expo-google-fonts/inter';

import '../services/i18n';
import { loadSavedLanguage } from '../services/i18n';
import { AQILoading } from '../components/AQILoading';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [isI18nReady, setIsI18nReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Manrope_400Regular,
        Manrope_500Medium,
        Manrope_600SemiBold,
        Manrope_700Bold,
        Manrope_800ExtraBold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_700Bold,
    });

    useEffect(() => {
        async function prepare() {
            try {
                await loadSavedLanguage();
                setIsI18nReady(true);
            } catch (e) {
                console.warn(e);
            }
        }
        prepare();
    }, []);

    useEffect(() => {
        if (fontsLoaded && isI18nReady) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isI18nReady]);

    if (!fontsLoaded || !isI18nReady) {
        return <AQILoading />;
    }

    return (
        <>
            <StatusBar style="dark" />
            <Slot />
        </>
    );
}
