// API Configuration
// NOTE: Replace these with your actual API keys

// Gemini API Key - Get yours at: https://aistudio.google.com/apikey
export const GEMINI_API_KEY = 'AIzaSyA2RlLplbaBMfmyOFPw6Ca0WDKjkk6kwsI';

// Cache durations in milliseconds
export const AQI_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (fresher data)
export const AI_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// API endpoints
export const AQICN_BASE_URL = 'https://api.waqi.info';

// App configuration
export const DEFAULT_CITY = 'pune';
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'te'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
