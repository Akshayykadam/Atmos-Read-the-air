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
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
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
                // Pre-load fonts, make any API calls you need to do here
                await loadSavedLanguage();
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady && (fontsLoaded || fontError)) {
            // This tells the splash screen to hide immediately! If we're already
            // in the middle of a render cycle, then this will be called after
            // the render has finished.
            SplashScreen.hideAsync();
        }
    }, [appIsReady, fontsLoaded, fontError]);

    if (!appIsReady || (!fontsLoaded && !fontError)) {
        return <AQILoading />;
    }

    return (
        <ThemeProvider>
            <InnerLayout />
        </ThemeProvider>
    );
}

function InnerLayout() {
    const { isDark } = useTheme();
    return (
        <>
            <StatusBar style={isDark ? "light" : "dark"} />
            <Slot />
        </>
    );
}
