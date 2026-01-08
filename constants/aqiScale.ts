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
        color: '#00E400',
        backgroundColor: '#E8F5E9',
        textColor: '#1B5E20',
        healthMessageKey: 'health.good',
    },
    {
        min: 51,
        max: 100,
        label: 'Moderate',
        labelKey: 'categories.moderate',
        color: '#FFFF00',
        backgroundColor: '#FFFDE7',
        textColor: '#F57F17',
        healthMessageKey: 'health.moderate',
    },
    {
        min: 101,
        max: 150,
        label: 'Unhealthy for Sensitive Groups',
        labelKey: 'categories.unhealthySensitive',
        color: '#FF7E00',
        backgroundColor: '#FFF3E0',
        textColor: '#E65100',
        healthMessageKey: 'health.unhealthySensitive',
    },
    {
        min: 151,
        max: 200,
        label: 'Unhealthy',
        labelKey: 'categories.unhealthy',
        color: '#FF0000',
        backgroundColor: '#FFEBEE',
        textColor: '#C62828',
        healthMessageKey: 'health.unhealthy',
    },
    {
        min: 201,
        max: 300,
        label: 'Very Unhealthy',
        labelKey: 'categories.veryUnhealthy',
        color: '#8F3F97',
        backgroundColor: '#F3E5F5',
        textColor: '#6A1B9A',
        healthMessageKey: 'health.veryUnhealthy',
    },
    {
        min: 301,
        max: 500,
        label: 'Hazardous',
        labelKey: 'categories.hazardous',
        color: '#7E0023',
        backgroundColor: '#FCE4EC',
        textColor: '#880E4F',
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
