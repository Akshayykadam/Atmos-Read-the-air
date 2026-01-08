import AsyncStorage from '@react-native-async-storage/async-storage';
import { AQI_CACHE_DURATION, AI_CACHE_DURATION } from '../constants/config';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

const CACHE_KEYS = {
    AQI_PREFIX: '@vayu_aqi_',
    AI_PREFIX: '@vayu_ai_',
    RECENT_CITIES: '@vayu_recent_cities',
    SELECTED_CITY: '@vayu_selected_city',
};

// Generic cache operations
async function getFromCache<T>(key: string): Promise<T | null> {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (!cached) return null;

        const item: CacheItem<T> = JSON.parse(cached);
        if (Date.now() > item.expiresAt) {
            await AsyncStorage.removeItem(key);
            return null;
        }
        return item.data;
    } catch (error) {
        console.error('Cache read error:', error);
        return null;
    }
}

async function setInCache<T>(
    key: string,
    data: T,
    duration: number
): Promise<void> {
    try {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + duration,
        };
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error('Cache write error:', error);
    }
}

// AQI cache operations
export async function getCachedAQI(cityId: string) {
    return getFromCache(`${CACHE_KEYS.AQI_PREFIX}${cityId}`);
}

export async function setCachedAQI(cityId: string, data: unknown) {
    return setInCache(`${CACHE_KEYS.AQI_PREFIX}${cityId}`, data, AQI_CACHE_DURATION);
}

// AI response cache operations
export async function getCachedAIResponse(
    cityId: string,
    aqi: number,
    language: string,
    promptKey: string
): Promise<string | null> {
    const cacheKey = `${CACHE_KEYS.AI_PREFIX}${cityId}_${aqi}_${language}_${promptKey}`;
    return getFromCache<string>(cacheKey);
}

export async function setCachedAIResponse(
    cityId: string,
    aqi: number,
    language: string,
    promptKey: string,
    response: string
): Promise<void> {
    const cacheKey = `${CACHE_KEYS.AI_PREFIX}${cityId}_${aqi}_${language}_${promptKey}`;
    return setInCache(cacheKey, response, AI_CACHE_DURATION);
}

// Recent cities operations
export async function getRecentCities(): Promise<string[]> {
    try {
        const cities = await AsyncStorage.getItem(CACHE_KEYS.RECENT_CITIES);
        return cities ? JSON.parse(cities) : [];
    } catch {
        return [];
    }
}

export async function addRecentCity(cityId: string): Promise<void> {
    try {
        const cities = await getRecentCities();
        const updated = [cityId, ...cities.filter((c) => c !== cityId)].slice(0, 5);
        await AsyncStorage.setItem(CACHE_KEYS.RECENT_CITIES, JSON.stringify(updated));
    } catch (error) {
        console.error('Error adding recent city:', error);
    }
}

// Selected city operations
export async function getSelectedCity(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(CACHE_KEYS.SELECTED_CITY);
    } catch {
        return null;
    }
}

export async function setSelectedCity(cityId: string): Promise<void> {
    try {
        await AsyncStorage.setItem(CACHE_KEYS.SELECTED_CITY, cityId);
    } catch (error) {
        console.error('Error saving selected city:', error);
    }
}

// Clear all cache
export async function clearAllCache(): Promise<void> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const vayuKeys = keys.filter((key) => key.startsWith('@vayu_'));
        await AsyncStorage.multiRemove(vayuKeys);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}
