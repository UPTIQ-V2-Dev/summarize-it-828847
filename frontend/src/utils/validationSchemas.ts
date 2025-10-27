import { z } from 'zod';

// Login form validation schema
export const loginFormSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address').toLowerCase(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be less than 100 characters')
});

// Summary form validation schema
export const summaryFormSchema = z.object({
    text: z
        .string()
        .min(10, 'Text must be at least 10 characters long')
        .max(10000, 'Text must be less than 10,000 characters')
        .trim(),
    length: z.enum(['short', 'medium', 'long'])
});

// API request validation schema
export const summaryRequestSchema = z.object({
    text: z.string().min(1, 'Text is required').max(10000),
    options: z
        .object({
            length: z.enum(['short', 'medium', 'long']).optional()
        })
        .optional()
});

// Text statistics validation
export const textStatsSchema = z.object({
    characterCount: z.number().min(0),
    wordCount: z.number().min(0),
    paragraphCount: z.number().min(0)
});

// Export inferred types
export type LoginFormInput = z.infer<typeof loginFormSchema>;
export type SummaryFormInput = z.infer<typeof summaryFormSchema>;
export type SummaryRequestInput = z.infer<typeof summaryRequestSchema>;
export type TextStatsInput = z.infer<typeof textStatsSchema>;

// Validation constants
export const VALIDATION_CONSTANTS = {
    MIN_TEXT_LENGTH: 10,
    MAX_TEXT_LENGTH: 10000,
    MIN_WORD_COUNT: 2,
    MAX_WORD_COUNT: 2000
} as const;
