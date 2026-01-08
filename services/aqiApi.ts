import { AQICN_API_TOKEN, AQICN_BASE_URL } from '../constants/config';
import { getCachedAQI, setCachedAQI } from './cacheService';

export interface PollutantData {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
}

export interface AQIData {
    aqi: number;
    city: string;
    station: string;
    dominantPollutant: string;
    pollutants: PollutantData;
    time: string;
    timestamp: number;
    isCached: boolean;
}

export interface AQIError {
    type: 'network' | 'api' | 'notFound' | 'unknown';
    message: string;
}

interface AQICNResponse {
    status: string;
    data: {
        aqi: number;
        idx: number;
        attributions: Array<{ url: string; name: string }>;
        city: {
            name: string;
            url: string;
            geo: [number, number];
        };
        dominentpol?: string;
        iaqi: {
            pm25?: { v: number };
            pm10?: { v: number };
            o3?: { v: number };
            no2?: { v: number };
            so2?: { v: number };
            co?: { v: number };
        };
        time: {
            s: string;
            tz: string;
            v: number;
            iso: string;
        };
    };
}

export async function fetchAQIByCity(cityId: string): Promise<AQIData> {
    // Check cache first
    const cached = await getCachedAQI(cityId);
    if (cached) {
        return { ...(cached as AQIData), isCached: true };
    }

    try {
        const url = `${AQICN_BASE_URL}/feed/${cityId}/?token=${AQICN_API_TOKEN}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw { type: 'network', message: 'Network request failed' } as AQIError;
        }

        const json: AQICNResponse = await response.json();

        if (json.status !== 'ok') {
            throw { type: 'notFound', message: 'City not found' } as AQIError;
        }

        const data = json.data;
        const aqiData: AQIData = {
            aqi: data.aqi,
            city: data.city.name,
            station: data.city.name,
            dominantPollutant: data.dominentpol || 'pm25',
            pollutants: {
                pm25: data.iaqi.pm25?.v,
                pm10: data.iaqi.pm10?.v,
                o3: data.iaqi.o3?.v,
                no2: data.iaqi.no2?.v,
                so2: data.iaqi.so2?.v,
                co: data.iaqi.co?.v,
            },
            time: data.time.iso,
            timestamp: data.time.v * 1000,
            isCached: false,
        };

        // Cache the result
        await setCachedAQI(cityId, aqiData);

        return aqiData;
    } catch (error) {
        if ((error as AQIError).type) {
            throw error;
        }
        throw { type: 'network', message: 'Network error' } as AQIError;
    }
}

export async function fetchAQIByCoordinates(
    lat: number,
    lng: number
): Promise<AQIData> {
    const cacheKey = `geo_${lat.toFixed(2)}_${lng.toFixed(2)}`;

    // Check cache first
    const cached = await getCachedAQI(cacheKey);
    if (cached) {
        return { ...(cached as AQIData), isCached: true };
    }

    try {
        const url = `${AQICN_BASE_URL}/feed/geo:${lat};${lng}/?token=${AQICN_API_TOKEN}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw { type: 'network', message: 'Network request failed' } as AQIError;
        }

        const json: AQICNResponse = await response.json();

        if (json.status !== 'ok') {
            throw { type: 'notFound', message: 'No station found nearby' } as AQIError;
        }

        const data = json.data;
        const aqiData: AQIData = {
            aqi: data.aqi,
            city: data.city.name,
            station: data.city.name,
            dominantPollutant: data.dominentpol || 'pm25',
            pollutants: {
                pm25: data.iaqi.pm25?.v,
                pm10: data.iaqi.pm10?.v,
                o3: data.iaqi.o3?.v,
                no2: data.iaqi.no2?.v,
                so2: data.iaqi.so2?.v,
                co: data.iaqi.co?.v,
            },
            time: data.time.iso,
            timestamp: data.time.v * 1000,
            isCached: false,
        };

        // Cache the result
        await setCachedAQI(cacheKey, aqiData);

        return aqiData;
    } catch (error) {
        if ((error as AQIError).type) {
            throw error;
        }
        throw { type: 'network', message: 'Network error' } as AQIError;
    }
}
