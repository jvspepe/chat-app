import { z } from 'zod';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const envSchema = z.object({
  MODE: z.enum(['development', 'production']),
  VITE_FIREBASE_API_KEY: z.string(),
  VITE_FIREBASE_APP_ID: z.string(),
  VITE_FIREBASE_AUTH_DOMAIN: z.string(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string(),
  VITE_FIREBASE_PROJECT_ID: z.string(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string(),
  VITE_FIREBASE_CONTINUE_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
