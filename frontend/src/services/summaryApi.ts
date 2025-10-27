import { api } from '@/lib/api';
import type { SummaryRequest, SummaryResponse } from '@/types/summary';
import { mockSummaryResponses } from '@/data/mockData';

const SUMMARY_ENDPOINTS = {
    GENERATE: '/api/summarize',
    HEALTH: '/api/health'
} as const;

/**
 * Generate a summary of the provided text
 */
export const generateSummary = async (data: SummaryRequest): Promise<SummaryResponse> => {
    // Return mock data if environment variable is set
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

        const length = data.options?.length || 'medium';
        return mockSummaryResponses[length];
    }

    const response = await api.post<SummaryResponse>(SUMMARY_ENDPOINTS.GENERATE, data);

    return response.data;
};

/**
 * Check API health status
 */
export const checkApiHealth = async (): Promise<{ status: string; timestamp: string }> => {
    // Return mock data if environment variable is set
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString()
        };
    }

    const response = await api.get<{ status: string; timestamp: string }>(SUMMARY_ENDPOINTS.HEALTH);

    return response.data;
};

/**
 * Generate summary with retry logic
 */
export const generateSummaryWithRetry = async (
    data: SummaryRequest,
    maxRetries: number = 3
): Promise<SummaryResponse> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await generateSummary(data);
        } catch (error) {
            lastError = error as Error;

            // Don't retry on the last attempt
            if (attempt === maxRetries) {
                break;
            }

            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError || new Error('Summary generation failed after multiple attempts');
};
