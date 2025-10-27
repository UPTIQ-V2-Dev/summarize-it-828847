import { api } from '@/lib/api';
import type { SummaryRequest, SummaryResponse } from '@/types/summary';
import { emitter } from '@/agentSdk';

const SUMMARY_ENDPOINTS = {
    GENERATE: '/api/summarize',
    HEALTH: '/api/health'
} as const;

/**
 * Generate a summary of the provided text using AI agent
 */
export const generateSummary = async (data: SummaryRequest): Promise<SummaryResponse> => {
    const agentResponse = await emitter.emit({
        agentId: 'f08a04f2-a317-4e14-a680-8233fa280d23',
        event: 'Original Text Input textbox',
        payload: {
            text: data.text,
            options: data.options
        }
    });

    // Transform agent response to match expected SummaryResponse format
    return {
        summary: agentResponse.summary,
        wordCount: data.text.split(/\s+/).filter(word => word.length > 0).length,
        processingTime: 1000 // Default processing time since agent doesn't provide this
    };
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
