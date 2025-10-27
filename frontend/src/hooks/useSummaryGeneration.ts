import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateSummary, generateSummaryWithRetry } from '@/services/summaryApi';
import type { SummaryRequest, SummaryResponse, SummaryError } from '@/types/summary';

const SUMMARY_QUERY_KEYS = {
    GENERATE: 'summary-generate',
    HISTORY: 'summary-history'
} as const;

/**
 * Custom hook for generating text summaries with React Query
 */
export const useSummaryGeneration = () => {
    const queryClient = useQueryClient();

    const summaryMutation = useMutation<SummaryResponse, SummaryError, SummaryRequest>({
        mutationFn: generateSummary,
        onSuccess: (data, variables) => {
            // Optionally cache the result for potential reuse
            queryClient.setQueryData([SUMMARY_QUERY_KEYS.GENERATE, variables.text], data);
        },
        onError: error => {
            console.error('Summary generation failed:', error);
        }
    });

    const summaryWithRetryMutation = useMutation<SummaryResponse, SummaryError, SummaryRequest>({
        mutationFn: request => generateSummaryWithRetry(request, 3),
        onSuccess: (data, variables) => {
            queryClient.setQueryData([SUMMARY_QUERY_KEYS.GENERATE, variables.text], data);
        },
        onError: error => {
            console.error('Summary generation with retry failed:', error);
        }
    });

    return {
        // Basic summary generation
        generateSummary: summaryMutation.mutate,
        generateSummaryAsync: summaryMutation.mutateAsync,
        isGenerating: summaryMutation.isPending,
        summaryData: summaryMutation.data,
        summaryError: summaryMutation.error,
        resetSummary: summaryMutation.reset,

        // Summary generation with retry
        generateSummaryWithRetry: summaryWithRetryMutation.mutate,
        generateSummaryWithRetryAsync: summaryWithRetryMutation.mutateAsync,
        isGeneratingWithRetry: summaryWithRetryMutation.isPending,
        summaryDataWithRetry: summaryWithRetryMutation.data,
        summaryErrorWithRetry: summaryWithRetryMutation.error,
        resetSummaryWithRetry: summaryWithRetryMutation.reset,

        // Combined states for easier consumption
        isLoading: summaryMutation.isPending || summaryWithRetryMutation.isPending,
        hasError: !!summaryMutation.error || !!summaryWithRetryMutation.error,
        data: summaryMutation.data || summaryWithRetryMutation.data,
        error: summaryMutation.error || summaryWithRetryMutation.error
    };
};
