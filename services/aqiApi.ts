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

export interface ForecastEntry {
    avg: number;
    day: string;
    max: number;
    min: number;
}

export interface DailyForecast {
    pm25?: ForecastEntry[];
    pm10?: ForecastEntry[];
    o3?: ForecastEntry[];
    uvi?: ForecastEntry[];
}

export interface WeatherData {
    temperature?: number;
    humidity?: number;
    wind?: number;
    pressure?: number;
}

export interface AQIData {
    aqi: number;
    city: string;
    station: string;
    dominantPollutant: string;
    pollutants: PollutantData;
    weather: WeatherData;
    forecast: DailyForecast;
    coordinates: {
        latitude: number;
        longitude: number;
    };
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
            t?: { v: number };
            h?: { v: number };
            w?: { v: number };
            p?: { v: number };
        };
        forecast?: {
            daily: {
                pm25?: Array<{ avg: number; day: string; max: number; min: number }>;
                pm10?: Array<{ avg: number; day: string; max: number; min: number }>;
                o3?: Array<{ avg: number; day: string; max: number; min: number }>;
                uvi?: Array<{ avg: number; day: string; max: number; min: number }>;
            };
        };
        time: {
            s: string;
            tz: string;
            v: number;
            iso: string;
        };
    };
}

export async function fetchAQIByCity(cityId: string, forceRefresh = false): Promise<AQIData> {
    // Check cache first
    if (!forceRefresh) {
        const cached = await getCachedAQI(cityId);
        // Ensure cached data has the new coordinates structure, otherwise fetch fresh
        if (cached && (cached as AQIData).coordinates) {
            return { ...(cached as AQIData), isCached: true };
        }
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
            weather: {
                temperature: data.iaqi.t?.v,
                humidity: data.iaqi.h?.v,
                wind: data.iaqi.w?.v,
                pressure: data.iaqi.p?.v,
            },
            forecast: {
                pm25: data.forecast?.daily?.pm25,
                pm10: data.forecast?.daily?.pm10,
                o3: data.forecast?.daily?.o3,
                uvi: data.forecast?.daily?.uvi,
            },
            coordinates: {
                latitude: data.city.geo[0],
                longitude: data.city.geo[1],
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
    lng: number,
    forceRefresh = false
): Promise<AQIData> {
    const cacheKey = `geo_${lat.toFixed(2)}_${lng.toFixed(2)}`;

    // Check cache first
    if (!forceRefresh) {
        const cached = await getCachedAQI(cacheKey);
        if (cached && (cached as AQIData).coordinates) {
            return { ...(cached as AQIData), isCached: true };
        }
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
            weather: {
                temperature: data.iaqi.t?.v,
                humidity: data.iaqi.h?.v,
                wind: data.iaqi.w?.v,
                pressure: data.iaqi.p?.v,
            },
            forecast: {
                pm25: data.forecast?.daily?.pm25,
                pm10: data.forecast?.daily?.pm10,
                o3: data.forecast?.daily?.o3,
                uvi: data.forecast?.daily?.uvi,
            },
            coordinates: {
                latitude: data.city.geo[0],
                longitude: data.city.geo[1],
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
export interface Station {
    uid: number;
    aqi: string;
    station: {
        name: string;
        geo: number[];
        url: string;
    };
}

interface SearchResponse {
    status: string;
    data: Station[];
}

export async function searchStations(keyword: string): Promise<Array<{ name: string; state: string; aqicnId: string }>> {
    try {
        const url = `${AQICN_BASE_URL}/search/?keyword=${encodeURIComponent(keyword)}&token=${AQICN_API_TOKEN}`;
        const response = await fetch(url);
        const json: SearchResponse = await response.json();

        if (json.status !== 'ok') return [];

        return json.data.map(station => {
            // Station name format is often "Station Name, City, Country" or "City - Station Name"
            // We'll just use the full name for clarity
            const parts = station.station.name.split(',');
            const name = parts[0].trim();
            const state = parts.length > 1 ? parts[1].trim() : '';

            return {
                name: station.station.name, // Use full name to identify specific locations
                state: state,
                aqicnId: `@${station.uid}`, // WAQI search returns UIDs which use @ prefix for feed
            };
        });
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

export type MapStation = {
    lat: number;
    lon: number;
    uid: number;
    aqi: string; // "123" or "-"
    station: {
        name: string;
        time: string;
    };
};

export async function fetchStationsInBounds(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number
): Promise<MapStation[]> {
    try {
        // WAQI API expects: latlng=lat1,lng1,lat2,lng2 (SW corner, NE corner)
        const url = `${AQICN_BASE_URL}/map/bounds/?latlng=${minLat},${minLng},${maxLat},${maxLng}&token=${AQICN_API_TOKEN}`;
        console.log('Fetching stations from:', url);
        const response = await fetch(url);
        const json = await response.json();

        console.log('Stations API response status:', json.status, 'count:', json.data?.length);

        if (json.status !== 'ok') return [];

        return json.data || [];
    } catch (error) {
        console.error('Error fetching map bounds:', error);
        return [];
    }
}

// OpenAQ API for historical data (free, no key required)
const OPENAQ_BASE_URL = 'https://api.openaq.org/v2';

export interface HistoricalDataPoint {
    value: number;
    time: string;
    hour: string;
}

export async function fetchHistoricalAQI(
    latitude: number,
    longitude: number,
    hours: number = 24,
    cityName?: string
): Promise<HistoricalDataPoint[]> {
    try {
        let locationId: number | null = null;
        let locationName = '';

        // Try searching by city name first (more reliable for Indian cities)
        if (cityName) {
            const cityUrl = `${OPENAQ_BASE_URL}/locations?city=${encodeURIComponent(cityName)}&limit=1&order_by=lastUpdated&sort=desc`;
            console.log(`OpenAQ: Searching for city "${cityName}"...`);

            const cityResponse = await fetch(cityUrl, {
                headers: { 'Accept': 'application/json' }
            });
            const cityJson = await cityResponse.json();

            if (cityJson.results && cityJson.results.length > 0) {
                locationId = cityJson.results[0].id;
                locationName = cityJson.results[0].name;
                console.log(`OpenAQ: Found station "${locationName}" in ${cityName}`);
            }
        }

        // Fallback: search by coordinates if city name didn't work
        if (!locationId) {
            const locationUrl = `${OPENAQ_BASE_URL}/locations?coordinates=${latitude},${longitude}&radius=50000&limit=1&order_by=distance`;
            console.log('OpenAQ: Searching by coordinates...');

            const locationResponse = await fetch(locationUrl, {
                headers: { 'Accept': 'application/json' }
            });
            const locationJson = await locationResponse.json();

            if (!locationJson.results || locationJson.results.length === 0) {
                console.log('OpenAQ: No nearby stations found');
                return [];
            }

            locationId = locationJson.results[0].id;
            locationName = locationJson.results[0].name;
            console.log(`OpenAQ: Found station "${locationName}" via coordinates`);
        }

        // Get measurements from the last 24 hours
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (hours * 60 * 60 * 1000));

        const measurementsUrl = `${OPENAQ_BASE_URL}/measurements?location_id=${locationId}&parameter=pm25&date_from=${startDate.toISOString()}&date_to=${endDate.toISOString()}&limit=100&order_by=datetime`;

        const measurementsResponse = await fetch(measurementsUrl, {
            headers: { 'Accept': 'application/json' }
        });
        const measurementsJson = await measurementsResponse.json();

        if (!measurementsJson.results || measurementsJson.results.length === 0) {
            console.log('OpenAQ: No measurements found');
            return [];
        }

        console.log(`OpenAQ: Got ${measurementsJson.results.length} measurements`);

        // Convert to our format - take every 3rd reading for cleaner graph
        const dataPoints: HistoricalDataPoint[] = measurementsJson.results
            .filter((_: any, index: number) => index % 3 === 0)
            .slice(0, 8) // Limit to 8 points for clean display
            .map((item: any) => {
                const date = new Date(item.date.utc);
                return {
                    value: Math.round(item.value),
                    time: item.date.utc,
                    hour: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
                };
            });

        return dataPoints;
    } catch (error) {
        console.error('OpenAQ error:', error);
        return [];
    }
}
