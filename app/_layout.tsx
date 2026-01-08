import React, { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../services/i18n';
import { loadSavedLanguage } from '../services/i18n';
import { AQILoading } from '../components/AQILoading';

export default function RootLayout() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            await loadSavedLanguage();
            setIsReady(true);
        }
        prepare();
    }, []);

    if (!isReady) {
        return <AQILoading />;
    }

    return (
        <>
            <StatusBar style="light" />
            <Slot />
        </>
    );
}
