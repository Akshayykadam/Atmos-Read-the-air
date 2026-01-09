// AQI Scale Constants based on US EPA standard
// https://www.airnow.gov/aqi/aqi-basics/

export interface AQICategory {
    min: number;
    max: number;
    label: string;
    labelKey: string; // i18n key
    color: string;
    backgroundColor: string;
    textColor: string;
    healthMessageKey: string;
}

export const AQI_CATEGORIES: AQICategory[] = [
    {
        min: 0,
        max: 50,
        label: 'Good',
        labelKey: 'categories.good',
        color: '#00D2A0', // Vibrant Mint
        backgroundColor: '#E6FBF5',
        textColor: '#004D40',
        healthMessageKey: 'health.good',
    },
    {
        min: 51,
        max: 100,
        label: 'Moderate',
        labelKey: 'categories.moderate',
        color: '#F9D71C', // Gen Z Yellow
        backgroundColor: '#FFFAEB',
        textColor: '#8C6C0A',
        healthMessageKey: 'health.moderate',
    },
    {
        min: 101,
        max: 150,
        label: 'Unhealthy for Sensitive Groups',
        labelKey: 'categories.unhealthySensitive',
        color: '#FF9F43', // Soft Orange
        backgroundColor: '#FFF5EB',
        textColor: '#E65100',
        healthMessageKey: 'health.unhealthySensitive',
    },
    {
        min: 151,
        max: 200,
        label: 'Unhealthy',
        labelKey: 'categories.unhealthy',
        color: '#FF6B6B', // Soft Red
        backgroundColor: '#FFF0F0',
        textColor: '#C0392B',
        healthMessageKey: 'health.unhealthy',
    },
    {
        min: 201,
        max: 300,
        label: 'Very Unhealthy',
        labelKey: 'categories.veryUnhealthy',
        color: '#A29BFE', // Lavender
        backgroundColor: '#F8F7FF',
        textColor: '#6C5CE7',
        healthMessageKey: 'health.veryUnhealthy',
    },
    {
        min: 301,
        max: 500,
        label: 'Hazardous',
        labelKey: 'categories.hazardous',
        color: '#2D3436', // Dark Slate (Neutral but scary)
        backgroundColor: '#F5F6FA',
        textColor: '#1A1A1A',
        healthMessageKey: 'health.hazardous',
    },
];

export function getAQICategory(aqi: number): AQICategory {
    for (const category of AQI_CATEGORIES) {
        if (aqi >= category.min && aqi <= category.max) {
            return category;
        }
    }
    // Default to hazardous for any value above 500
    return AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
}

export const POLLUTANT_NAMES: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    o3: 'Ozone (O₃)',
    no2: 'Nitrogen Dioxide (NO₂)',
    so2: 'Sulfur Dioxide (SO₂)',
    co: 'Carbon Monoxide (CO)',
};
