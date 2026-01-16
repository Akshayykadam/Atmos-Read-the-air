// Open-Meteo Air Quality API Service (Free, no API key needed)
// This provides fresh, real-time AQI data for locations where AQICN stations are offline

import { getCachedAQI, setCachedAQI } from './cacheService';

const OPEN_METEO_AQ_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export interface OpenMeteoAQIData {
    aqi: number;
    europeanAqi: number;
    pollutants: {
        pm25: number;
        pm10: number;
        o3: number;
        no2: number;
        so2: number;
        co: number;
    };
    time: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

interface OpenMeteoAQResponse {
    latitude: number;
    longitude: number;
    current: {
        time: string;
        pm10: number;
        pm2_5: number;
        carbon_monoxide: number;
        nitrogen_dioxide: number;
        sulphur_dioxide: number;
        ozone: number;
        european_aqi: number;
        us_aqi: number;
    };
}

// Determine dominant pollutant based on values
function getDominantPollutant(pollutants: OpenMeteoAQIData['pollutants']): string {
    const values = [
        { name: 'pm25', value: pollutants.pm25, threshold: 35.4 },
        { name: 'pm10', value: pollutants.pm10, threshold: 154 },
        { name: 'o3', value: pollutants.o3, threshold: 164 },
        { name: 'no2', value: pollutants.no2, threshold: 100 },
        { name: 'so2', value: pollutants.so2, threshold: 185 },
        { name: 'co', value: pollutants.co / 1000, threshold: 12.4 }, // Convert to mg/m³
    ];

    // Find the pollutant that exceeds its threshold the most
    let dominant = 'pm25';
    let maxRatio = 0;

    for (const p of values) {
        const ratio = p.value / p.threshold;
        if (ratio > maxRatio) {
            maxRatio = ratio;
            dominant = p.name;
        }
    }

    return dominant;
}

// Fetch AQI data from Open-Meteo (Free, always has fresh data!)
export async function fetchOpenMeteoAQI(
    latitude: number,
    longitude: number,
    forceRefresh = false
): Promise<OpenMeteoAQIData> {
    const cacheKey = `openmeteo_aqi_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

    // Check cache first
    if (!forceRefresh) {
        const cached = await getCachedAQI(cacheKey);
        if (cached) {
            return cached as OpenMeteoAQIData;
        }
    }

    const url = `${OPEN_METEO_AQ_URL}?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch Open-Meteo AQI data');
    }

    const data: OpenMeteoAQResponse = await response.json();

    const result: OpenMeteoAQIData = {
        aqi: data.current.us_aqi,
        europeanAqi: data.current.european_aqi,
        pollutants: {
            pm25: data.current.pm2_5,
            pm10: data.current.pm10,
            o3: data.current.ozone,
            no2: data.current.nitrogen_dioxide,
            so2: data.current.sulphur_dioxide,
            co: data.current.carbon_monoxide,
        },
        time: data.current.time,
        coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
        },
    };

    // Cache the result
    await setCachedAQI(cacheKey, result);

    return result;
}

// Get dominant pollutant for UI
export { getDominantPollutant };
