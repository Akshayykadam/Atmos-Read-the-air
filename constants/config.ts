// API Configuration
// NOTE: Replace these with your actual API keys

// AQICN API Token - Get yours at: https://aqicn.org/data-platform/token/
export const AQICN_API_TOKEN = 'adff80ae0d18865c7526c21f7c850cd071b8085e';

// Gemini API Key - Get yours at: https://aistudio.google.com/apikey
export const GEMINI_API_KEY = 'AIzaSyA2RlLplbaBMfmyOFPw6Ca0WDKjkk6kwsI';

// Cache durations in milliseconds
export const AQI_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
export const AI_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// API endpoints
export const AQICN_BASE_URL = 'https://api.waqi.info';

// App configuration
export const DEFAULT_CITY = 'pune';
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'ta', 'te'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
