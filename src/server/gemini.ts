import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini on server-side only
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const DEFAULT_MODEL = 'gemini-3.8-flash';

/**
 * Utility to safely parse JSON from Gemini response, stripping markdown fences if present
 */
export function parseGeminiJson<T>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn('Failed to parse Gemini JSON output:', err, 'Raw:', rawText);
    return fallback;
  }
}
