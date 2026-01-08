import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';
import ta from '../locales/ta.json';
import te from '../locales/te.json';

const LANGUAGE_STORAGE_KEY = '@vayu_language';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
    ta: { translation: ta },
    te: { translation: te },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

// Load saved language preference
export async function loadSavedLanguage(): Promise<string> {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && Object.keys(resources).includes(savedLanguage)) {
            await i18n.changeLanguage(savedLanguage);
            return savedLanguage;
        }
    } catch (error) {
        console.error('Error loading saved language:', error);
    }
    return 'en';
}

// Save language preference
export async function saveLanguage(language: string): Promise<void> {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        await i18n.changeLanguage(language);
    } catch (error) {
        console.error('Error saving language:', error);
    }
}

// Get language name for display
export function getLanguageDisplayName(code: string): string {
    const names: Record<string, string> = {
        en: 'English',
        hi: 'हिन्दी',
        mr: 'मराठी',
        ta: 'தமிழ்',
        te: 'తెలుగు',
    };
    return names[code] || code;
}

export default i18n;
