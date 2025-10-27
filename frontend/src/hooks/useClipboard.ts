import { useState, useCallback } from 'react';

interface UseClipboardOptions {
    successDuration?: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

interface UseClipboardReturn {
    copied: boolean;
    copy: (text: string) => Promise<void>;
    error: string | null;
    isSupported: boolean;
}

/**
 * Custom hook for clipboard operations
 */
export const useClipboard = (options: UseClipboardOptions = {}): UseClipboardReturn => {
    const { successDuration = 2000, onSuccess, onError } = options;

    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if clipboard API is supported
    const isSupported =
        typeof window !== 'undefined' &&
        'navigator' in window &&
        'clipboard' in navigator &&
        typeof navigator.clipboard.writeText === 'function';

    const copy = useCallback(
        async (text: string) => {
            if (!isSupported) {
                const errorMessage = 'Clipboard API not supported';
                setError(errorMessage);
                onError?.(new Error(errorMessage));
                return;
            }

            if (!text) {
                const errorMessage = 'No text provided to copy';
                setError(errorMessage);
                onError?.(new Error(errorMessage));
                return;
            }

            try {
                setError(null);
                await navigator.clipboard.writeText(text);

                setCopied(true);
                onSuccess?.();

                // Reset copied state after success duration
                setTimeout(() => {
                    setCopied(false);
                }, successDuration);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to copy text';
                setError(errorMessage);
                onError?.(err as Error);
                setCopied(false);
            }
        },
        [isSupported, successDuration, onSuccess, onError]
    );

    return {
        copied,
        copy,
        error,
        isSupported
    };
};
