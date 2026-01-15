// Open-Meteo Weather API Service (Free, no API key needed)

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1';

export interface CurrentWeather {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    uvIndex: number;
    pressure: number;
    visibility: number;
    isDay: boolean;
}

export interface HourlyForecast {
    time: string;
    hour: string;
    temperature: number;
    weatherCode: number;
    precipitation: number;
    humidity: number;
    windSpeed: number;
}

export interface DailyForecast {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
    uvIndexMax: number;
    precipitationSum: number;
    sunrise: string;
    sunset: string;
}

export interface OpenMeteoData {
    current: CurrentWeather;
    hourly: HourlyForecast[];
    daily: DailyForecast[];
    timezone: string;
}

// Weather code to description and icon mapping
export function getWeatherInfo(code: number, isDay: boolean = true): { description: string; icon: string } {
    const weatherCodes: Record<number, { description: string; dayIcon: string; nightIcon: string }> = {
        0: { description: 'Clear sky', dayIcon: 'sunny', nightIcon: 'moon' },
        1: { description: 'Mainly clear', dayIcon: 'sunny', nightIcon: 'moon' },
        2: { description: 'Partly cloudy', dayIcon: 'partly-sunny', nightIcon: 'cloudy-night' },
        3: { description: 'Overcast', dayIcon: 'cloudy', nightIcon: 'cloudy' },
        45: { description: 'Foggy', dayIcon: 'cloud', nightIcon: 'cloud' },
        48: { description: 'Rime fog', dayIcon: 'cloud', nightIcon: 'cloud' },
        51: { description: 'Light drizzle', dayIcon: 'rainy', nightIcon: 'rainy' },
        53: { description: 'Drizzle', dayIcon: 'rainy', nightIcon: 'rainy' },
        55: { description: 'Heavy drizzle', dayIcon: 'rainy', nightIcon: 'rainy' },
        61: { description: 'Light rain', dayIcon: 'rainy', nightIcon: 'rainy' },
        63: { description: 'Rain', dayIcon: 'rainy', nightIcon: 'rainy' },
        65: { description: 'Heavy rain', dayIcon: 'rainy', nightIcon: 'rainy' },
        71: { description: 'Light snow', dayIcon: 'snow', nightIcon: 'snow' },
        73: { description: 'Snow', dayIcon: 'snow', nightIcon: 'snow' },
        75: { description: 'Heavy snow', dayIcon: 'snow', nightIcon: 'snow' },
        77: { description: 'Snow grains', dayIcon: 'snow', nightIcon: 'snow' },
        80: { description: 'Light showers', dayIcon: 'rainy', nightIcon: 'rainy' },
        81: { description: 'Showers', dayIcon: 'rainy', nightIcon: 'rainy' },
        82: { description: 'Heavy showers', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
        85: { description: 'Snow showers', dayIcon: 'snow', nightIcon: 'snow' },
        86: { description: 'Heavy snow showers', dayIcon: 'snow', nightIcon: 'snow' },
        95: { description: 'Thunderstorm', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
        96: { description: 'Thunderstorm with hail', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
        99: { description: 'Thunderstorm with heavy hail', dayIcon: 'thunderstorm', nightIcon: 'thunderstorm' },
    };

    const weather = weatherCodes[code] || { description: 'Unknown', dayIcon: 'cloud', nightIcon: 'cloud' };
    return {
        description: weather.description,
        icon: isDay ? weather.dayIcon : weather.nightIcon,
    };
}

export async function fetchOpenMeteoWeather(
    latitude: number,
    longitude: number
): Promise<OpenMeteoData | null> {
    try {
        const currentParams = [
            'temperature_2m',
            'relative_humidity_2m',
            'apparent_temperature',
            'weather_code',
            'wind_speed_10m',
            'wind_direction_10m',
            'uv_index',
            'surface_pressure',
            'visibility',
            'is_day',
        ].join(',');

        const hourlyParams = [
            'temperature_2m',
            'weather_code',
            'precipitation_probability',
            'relative_humidity_2m',
            'wind_speed_10m',
        ].join(',');

        const dailyParams = [
            'weather_code',
            'temperature_2m_max',
            'temperature_2m_min',
            'uv_index_max',
            'precipitation_sum',
            'sunrise',
            'sunset',
        ].join(',');

        const url = `${OPEN_METEO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto&forecast_days=7`;

        console.log('OpenMeteo: Fetching weather data...');
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('OpenMeteo error:', data.reason);
            return null;
        }

        console.log('OpenMeteo: Got weather data');

        // Parse current weather
        const current: CurrentWeather = {
            temperature: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            windDirection: data.current.wind_direction_10m,
            weatherCode: data.current.weather_code,
            uvIndex: data.current.uv_index,
            pressure: data.current.surface_pressure,
            visibility: data.current.visibility / 1000, // Convert to km
            isDay: data.current.is_day === 1,
        };

        // Parse hourly forecast (next 12 hours starting from current hour)
        const hourly: HourlyForecast[] = [];
        const now = new Date();
        const currentHour = now.getHours();

        // Find the starting index for current hour
        let startIndex = 0;
        for (let i = 0; i < data.hourly.time.length; i++) {
            const hourTime = new Date(data.hourly.time[i]);
            if (hourTime.getDate() === now.getDate() && hourTime.getHours() >= currentHour) {
                startIndex = i;
                break;
            }
        }

        console.log('OpenMeteo: Starting hourly from index', startIndex);

        // Get next 12 hours from start index
        for (let i = startIndex; i < startIndex + 12 && i < data.hourly.time.length; i++) {
            const time = new Date(data.hourly.time[i]);
            hourly.push({
                time: data.hourly.time[i],
                hour: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                temperature: Math.round(data.hourly.temperature_2m[i]),
                weatherCode: data.hourly.weather_code[i],
                precipitation: data.hourly.precipitation_probability?.[i] || 0,
                humidity: data.hourly.relative_humidity_2m[i],
                windSpeed: Math.round(data.hourly.wind_speed_10m[i]),
            });
        }

        console.log('OpenMeteo: Got', hourly.length, 'hourly entries');

        // Parse daily forecast
        const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => {
            const d = new Date(date);
            return {
                date,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                tempMax: Math.round(data.daily.temperature_2m_max[i]),
                tempMin: Math.round(data.daily.temperature_2m_min[i]),
                weatherCode: data.daily.weather_code[i],
                uvIndexMax: data.daily.uv_index_max[i],
                precipitationSum: data.daily.precipitation_sum[i],
                sunrise: new Date(data.daily.sunrise[i]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
                sunset: new Date(data.daily.sunset[i]).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),
            };
        });

        return {
            current,
            hourly,
            daily,
            timezone: data.timezone,
        };
    } catch (error) {
        console.error('OpenMeteo fetch error:', error);
        return null;
    }
}
