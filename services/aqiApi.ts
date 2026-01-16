import { getCachedAQI, setCachedAQI } from './cacheService';
import { INDIAN_CITIES } from '../constants/cities';
import { getCityName } from './locationService';

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
    type: 'permission' | 'timeout' | 'unavailable' | 'network' | 'notFound';
    message: string;
}


// Known city coordinates are now in INDIAN_CITIES in constants/cities.ts

export async function fetchAQIByCity(cityId: string, forceRefresh = false): Promise<AQIData> {
    // 1. Try to find city in our static list first (fastest)
    const normalizedCityId = cityId.toLowerCase();
    const city = INDIAN_CITIES.find(c => c.aqicnId === normalizedCityId || c.name.toLowerCase() === normalizedCityId);

    if (city && city.lat && city.lng) {
        return fetchAQIByCoordinates(city.lat, city.lng, forceRefresh);
    }

    // 2. If not found, try to geocode the city name using Open-Meteo Geocoding API
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityId)}&count=1&format=json`;
        const response = await fetch(geoUrl);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const { latitude, longitude } = data.results[0];
            return fetchAQIByCoordinates(latitude, longitude, forceRefresh);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }

    throw { type: 'notFound', message: 'City not found' } as AQIError;
}

export async function fetchAQIByCoordinates(
    lat: number,
    lng: number,
    forceRefresh = false
): Promise<AQIData> {
    const cacheKey = `openmeteo_${lat.toFixed(2)}_${lng.toFixed(2)}`;

    // Check cache first
    if (!forceRefresh) {
        const cached = await getCachedAQI(cacheKey);
        if (cached && (cached as AQIData).coordinates) {
            return { ...(cached as AQIData), isCached: true };
        }
    }

    try {
        // PRIMARY: Use Open-Meteo Air Quality API (always has fresh data!)
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw { type: 'network', message: 'Network request failed' } as AQIError;
        }

        const data = await response.json();

        // Determine dominant pollutant
        const pollutants = {
            pm25: data.current.pm2_5,
            pm10: data.current.pm10,
            o3: data.current.ozone,
            no2: data.current.nitrogen_dioxide,
            so2: data.current.sulphur_dioxide,
            co: data.current.carbon_monoxide,
        };

        // Find dominant pollutant based on contribution to AQI
        let dominantPollutant = 'pm25';
        const thresholds = { pm25: 35.4, pm10: 154, o3: 164, no2: 100, so2: 185, co: 12400 };
        let maxRatio = 0;
        for (const [key, value] of Object.entries(pollutants)) {
            const ratio = (value || 0) / (thresholds[key as keyof typeof thresholds] || 1);
            if (ratio > maxRatio) {
                maxRatio = ratio;
                dominantPollutant = key;
            }
        }

        // Get city name from native geocoding (reliable) or use "Near You"
        let cityName = 'Near You';
        try {
            // Import this dynamically or assume it's available via parameters/imports
            // Since we can't easily change imports in replace block without context, we assume import is added
            // Actually, best to do this in the app layer, but for now let's try to use the service if imported

            // Note: We need to import getCityName at the top of the file
            const nativeCity = await getCityName(lat, lng);
            if (nativeCity) {
                cityName = nativeCity;
            }
        } catch {
            // Ignore geocoding errors
        }

        const aqiData: AQIData = {
            aqi: data.current.us_aqi,
            city: cityName,
            station: 'Open-Meteo Model',
            dominantPollutant,
            pollutants,
            weather: {
                // Weather data comes from separate API call
            },
            forecast: await fetchForecastData(lat, lng),
            coordinates: {
                latitude: data.latitude,
                longitude: data.longitude,
            },
            time: data.current.time,
            timestamp: new Date(data.current.time).getTime(),
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


export async function searchStations(keyword: string): Promise<Array<{ name: string; state: string; aqicnId: string; lat: number; lon: number }>> {
    try {
        // Use Open-Meteo Geocoding API instead of AQICN search
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(keyword)}&count=10&format=json`;
        const response = await fetch(url);
        const json = await response.json();

        if (!json.results) return [];

        return json.results.map((place: any) => {
            return {
                name: place.name,
                state: place.admin1 || place.country,
                aqicnId: place.name.toLowerCase(), // Use name as ID since we don't have station IDs
                lat: place.latitude,
                lon: place.longitude,
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
    aqi: string;
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
    // Open-Meteo provides global coverage, not discrete stations.
    // For now, we disable the map pins to remove AQICN dependency.
    // Future improvement: Sample grid points within bounds.
    return [];
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

async function fetchForecastData(lat: number, lng: number): Promise<DailyForecast> {
    try {
        // Fetch 3 days history + 4 days forecast (total ~7 days trend)
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&hourly=pm2_5&timezone=auto&past_days=3&forecast_days=4`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.hourly || !data.hourly.time || !data.hourly.pm2_5) {
            return { pm25: [] };
        }

        const times = data.hourly.time as string[];
        const values = data.hourly.pm2_5 as (number | null)[];

        // Group by day
        const dailyMap = new Map<string, number[]>();

        times.forEach((timeStr, index) => {
            const value = values[index];
            if (value === null || value === undefined) return;

            const day = timeStr.split('T')[0]; // YYYY-MM-DD
            if (!dailyMap.has(day)) {
                dailyMap.set(day, []);
            }
            dailyMap.get(day)?.push(value);
        });

        // Calculate min/max/avg for each day
        const forecastEntries: ForecastEntry[] = [];

        dailyMap.forEach((vals, day) => {
            if (vals.length > 0) {
                const min = Math.min(...vals);
                const max = Math.max(...vals);
                const sum = vals.reduce((a, b) => a + b, 0);
                const avg = Math.round(sum / vals.length);

                forecastEntries.push({
                    day,
                    min,
                    max,
                    avg
                });
            }
        });

        // Sort by date
        forecastEntries.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

        return { pm25: forecastEntries };
    } catch (error) {
        console.error('Forecast fetch error:', error);
        return { pm25: [] };
    }
}
