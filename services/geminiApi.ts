import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../constants/config';
import { AQIData } from './aqiApi';
import { getAQICategory } from '../constants/aqiScale';
import { getCachedAIResponse, setCachedAIResponse } from './cacheService';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Language code to full name mapping for prompts
const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
};

// Language-specific instructions for responses
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
    en: 'Respond in simple, clear English.',
    hi: 'सरल हिंदी में उत्तर दें। तकनीकी शब्दों से बचें।',
    mr: 'सोप्या मराठीत उत्तर द्या. तांत्रिक शब्द टाळा.',
    ta: 'எளிய தமிழில் பதிலளிக்கவும். தொழில்நுட்ப சொற்களைத் தவிர்க்கவும்.',
    te: 'సరళమైన తెలుగులో సమాధానం ఇవ్వండి. సాంకేతిక పదాలను నివారించండి.',
};

export interface AIResponse {
    text: string;
    isCached: boolean;
}

export interface AIError {
    type: 'quota' | 'network' | 'unknown';
    message: string;
}

function buildContextPrompt(aqiData: AQIData, language: string): string {
    const category = getAQICategory(aqiData.aqi);
    const languageName = LANGUAGE_NAMES[language] || 'English';
    const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;

    const pollutantList = Object.entries(aqiData.pollutants)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join(', ');

    return `You are an air quality health assistant for India.

CURRENT CONDITIONS:
- City: ${aqiData.city}
- AQI: ${aqiData.aqi} (${category.label})
- Dominant Pollutant: ${aqiData.dominantPollutant.toUpperCase()}
- Pollutant Levels: ${pollutantList}
- Time: ${new Date(aqiData.timestamp).toLocaleString()}

RULES:
1. ${languageInstruction}
2. Keep responses brief (2-3 sentences max).
3. Be informative, not alarmist.
4. Do not provide medical diagnosis.
5. Focus on practical, actionable advice.
6. Respond in ${languageName}.`;
}

export async function getAIResponse(
    aqiData: AQIData,
    userQuery: string,
    language: string,
    promptKey?: string
): Promise<AIResponse> {
    // Check cache first for predefined prompts
    if (promptKey) {
        const cached = await getCachedAIResponse(
            aqiData.city,
            aqiData.aqi,
            language,
            promptKey
        );
        if (cached) {
            return { text: cached, isCached: true };
        }
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

        const contextPrompt = buildContextPrompt(aqiData, language);
        const fullPrompt = `${contextPrompt}\n\nUSER QUESTION: ${userQuery}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        // Cache the response for predefined prompts
        if (promptKey) {
            await setCachedAIResponse(
                aqiData.city,
                aqiData.aqi,
                language,
                promptKey,
                text
            );
        }

        return { text, isCached: false };
    } catch (error: unknown) {
        console.error('Gemini API error:', error);

        // Check for quota errors
        if (error instanceof Error && error.message?.includes('quota')) {
            throw { type: 'quota', message: 'API quota exceeded' } as AIError;
        }

        throw { type: 'network', message: 'Failed to get AI response' } as AIError;
    }
}

// Predefined prompt keys for caching
export const PROMPT_KEYS = {
    WHY_HIGH: 'why_high',
    PRECAUTIONS: 'precautions',
    OUTDOOR_SAFE: 'outdoor_safe',
    MASK_NEEDED: 'mask_needed',
} as const;
