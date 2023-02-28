export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const OPENAI_ACCESS_TOKEN = import.meta.env.VITE_OPENAI_ACCESS_TOKEN;

if (!OPENAI_API_KEY || !OPENAI_ACCESS_TOKEN) {
  throw new Error('frontend missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN');
}