import { GoogleGenAI } from '@google/genai';

// Initialize Gemini SDK on server-side only
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Supported official Gemini models according to Google Gen AI specifications
export const PRIMARY_MODEL = 'gemini-3.1-flash-lite';
export const SECONDARY_MODEL = 'gemini-3.8-flash';
export const DEFAULT_MODEL = PRIMARY_MODEL;

export interface SanitizedPart {
  text: string;
}

export interface SanitizedTurn {
  role: 'user' | 'model';
  parts: SanitizedPart[];
}

/**
 * Validates and sanitizes multi-turn chat messages for Gemini API.
 * Rules enforced:
 * 1. The first message must always have role 'user' (never starts with assistant greeting).
 * 2. Consecutive messages with identical roles are combined into a single turn.
 * 3. Empty or whitespace-only messages are removed.
 * 4. The sequence alternates strictly between 'user' and 'model' and ends with 'user'.
 */
export function sanitizeChatContents(rawMessages: Array<{ role: string; content: string }>): SanitizedTurn[] {
  if (!Array.isArray(rawMessages)) return [];

  const turns: SanitizedTurn[] = [];

  for (const m of rawMessages) {
    const text = (m?.content || '').trim();
    if (!text) continue;

    const role: 'user' | 'model' = m.role === 'student' || m.role === 'user' ? 'user' : 'model';

    // Rule 1: The very first turn sent to Gemini multi-turn must be from 'user'
    if (turns.length === 0 && role === 'model') {
      continue;
    }

    // Rule 2: If consecutive roles are identical, merge text
    if (turns.length > 0 && turns[turns.length - 1].role === role) {
      turns[turns.length - 1].parts[0].text += '\n\n' + text;
    } else {
      turns.push({ role, parts: [{ text }] });
    }
  }

  // Rule 4: Must end with a user turn
  while (turns.length > 0 && turns[turns.length - 1].role === 'model') {
    turns.pop();
  }

  return turns;
}

/**
 * Categorizes and formats errors into secure, actionable student-friendly descriptions.
 * Never leaks private keys or credentials.
 */
export function formatGeminiError(error: any): { message: string; code: string; retryable: boolean } {
  const errString = String(error?.message || error?.statusText || error || '');
  const status = error?.status || error?.code || error?.error?.code;

  if (!process.env.GEMINI_API_KEY) {
    return {
      message: 'Gemini API key is not configured on the server. Please add GEMINI_API_KEY in the AI Studio Secrets panel or environment.',
      code: 'API_KEY_MISSING',
      retryable: false
    };
  }

  if (status === 429 || errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED') || errString.includes('quota')) {
    return {
      message: 'Gemini API rate limit or project quota has been reached. Please wait a brief moment before sending your next question.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryable: true
    };
  }

  if (status === 503 || errString.includes('503') || errString.includes('UNAVAILABLE') || errString.includes('high demand')) {
    return {
      message: 'The AI Tutor model is currently experiencing temporary high demand. Please retry your question shortly.',
      code: 'MODEL_UNAVAILABLE',
      retryable: true
    };
  }

  if (status === 400 || errString.includes('INVALID_ARGUMENT')) {
    return {
      message: 'Your query could not be processed due to an invalid request format. Please try rephrasing your question.',
      code: 'INVALID_REQUEST',
      retryable: false
    };
  }

  if (status === 401 || status === 403 || errString.includes('PERMISSION_DENIED')) {
    return {
      message: 'The configured Gemini API key is unauthorized or invalid. Please verify the key in AI Studio Secrets.',
      code: 'UNAUTHORIZED_KEY',
      retryable: false
    };
  }

  return {
    message: 'Unable to reach the Gemini AI Tutor service. Please check your network connection and retry.',
    code: 'NETWORK_OR_SERVER_ERROR',
    retryable: true
  };
}

export interface GenerateWithFallbackOptions {
  contents: SanitizedTurn[] | string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}

/**
 * Executes a Gemini request with automatic model fallback between supported models:
 * 1. Tries PRIMARY_MODEL (gemini-3.1-flash-lite - fast, reliable)
 * 2. If rate limited or unavailable, falls back to SECONDARY_MODEL (gemini-3.8-flash)
 */
export async function generateContentWithFallback(options: GenerateWithFallbackOptions): Promise<{ text: string; modelUsed: string }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const modelsToTry = [PRIMARY_MODEL, SECONDARY_MODEL];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents as any,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.6,
          ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {})
        }
      });

      if (response && typeof response.text === 'string') {
        return {
          text: response.text,
          modelUsed: model
        };
      }
    } catch (err: any) {
      console.warn(`[Gemini SDK] Model '${model}' attempt encountered error (status ${err?.status || err?.code}):`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError;
}

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
    console.warn('Failed to parse Gemini JSON output:', err, 'Raw text length:', rawText?.length);
    return fallback;
  }
}
