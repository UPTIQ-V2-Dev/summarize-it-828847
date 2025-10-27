import type { TextStats } from '@/types/summary';

/**
 * Calculate text statistics including character count, word count, and paragraph count
 */
export const calculateTextStats = (text: string): TextStats => {
    if (!text.trim()) {
        return {
            characterCount: 0,
            wordCount: 0,
            paragraphCount: 0
        };
    }

    const characterCount = text.length;

    // Count words by splitting on whitespace and filtering out empty strings
    const words = text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);
    const wordCount = words.length;

    // Count paragraphs by splitting on double newlines or single newlines
    const paragraphs = text
        .trim()
        .split(/\n\s*\n/)
        .filter(paragraph => paragraph.trim().length > 0);
    const paragraphCount = paragraphs.length;

    return {
        characterCount,
        wordCount,
        paragraphCount
    };
};

/**
 * Get reading time estimate in minutes
 */
export const getReadingTime = (text: string, wordsPerMinute: number = 200): number => {
    const { wordCount } = calculateTextStats(text);
    return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Truncate text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number, ellipsis: string = '...'): string => {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength - ellipsis.length) + ellipsis;
};

/**
 * Format text statistics for display
 */
export const formatTextStats = (stats: TextStats): string => {
    const { characterCount, wordCount, paragraphCount } = stats;

    const parts = [];

    if (wordCount > 0) {
        parts.push(`${wordCount.toLocaleString()} word${wordCount === 1 ? '' : 's'}`);
    }

    if (characterCount > 0) {
        parts.push(`${characterCount.toLocaleString()} character${characterCount === 1 ? '' : 's'}`);
    }

    if (paragraphCount > 0) {
        parts.push(`${paragraphCount} paragraph${paragraphCount === 1 ? '' : 's'}`);
    }

    return parts.join(', ');
};

/**
 * Clean and normalize text input
 */
export const cleanText = (text: string): string => {
    return text
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n\s*\n/g, '\n\n'); // Replace multiple newlines with double newlines
};

/**
 * Check if text meets minimum requirements for summarization
 */
export const isTextSummarizable = (text: string, minWords: number = 10): boolean => {
    const { wordCount } = calculateTextStats(text);
    return wordCount >= minWords;
};

/**
 * Get estimated processing time based on text length
 */
export const getEstimatedProcessingTime = (text: string): number => {
    const { wordCount } = calculateTextStats(text);

    // Base time + additional time per word
    const baseTime = 0.5; // seconds
    const timePerWord = 0.003; // seconds per word

    return Math.max(baseTime, wordCount * timePerWord);
};

/**
 * Format processing time for display
 */
export const formatProcessingTime = (seconds: number): string => {
    if (seconds < 1) {
        return 'Less than 1 second';
    }

    if (seconds < 60) {
        return `${Math.round(seconds)} second${Math.round(seconds) === 1 ? '' : 's'}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    if (remainingSeconds === 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Extract text preview for display purposes
 */
export const getTextPreview = (text: string, maxLength: number = 100): string => {
    const cleaned = cleanText(text);
    return truncateText(cleaned, maxLength);
};
