import ApiError from '../utils/ApiError.ts';
import httpStatus from 'http-status';

/**
 * Generate summary of provided text
 * @param {string} text - Text to summarize
 * @param {string} length - Summary length option (short, medium, long)
 * @returns {Object}
 */
const generateSummary = (
    text: string,
    length: string = 'medium'
): {
    summary: string;
    wordCount: number;
    processingTime: number;
} => {
    const startTime = Date.now();

    if (!text || typeof text !== 'string') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input - text is required');
    }

    if (text.length > 10000) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Text too long - maximum 10,000 characters');
    }

    const validLengths = ['short', 'medium', 'long'];
    if (length && !validLengths.includes(length)) {
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid length option - must be short, medium, or long');
    }

    // Simple text summarization logic
    let summary: string;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);

    if (sentences.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid input - text contains no meaningful content');
    }

    let targetSentences: number;
    switch (length) {
        case 'short':
            targetSentences = Math.max(1, Math.ceil(sentences.length * 0.2));
            break;
        case 'long':
            targetSentences = Math.max(1, Math.ceil(sentences.length * 0.6));
            break;
        case 'medium':
        default:
            targetSentences = Math.max(1, Math.ceil(sentences.length * 0.4));
            break;
    }

    // Select key sentences (simplified approach - take first, middle, and last sentences)
    const selectedSentences: string[] = [];
    if (sentences.length <= targetSentences) {
        selectedSentences.push(...sentences);
    } else {
        // Take first sentence
        selectedSentences.push(sentences[0]);

        // Take middle sentences if we need more
        if (targetSentences > 2) {
            const middleStart = Math.floor(sentences.length / 3);
            const middleEnd = Math.floor((sentences.length * 2) / 3);
            const middleCount = targetSentences - 2;
            const step = Math.max(1, Math.floor((middleEnd - middleStart) / middleCount));

            for (let i = 0; i < middleCount && middleStart + i * step < middleEnd; i++) {
                selectedSentences.push(sentences[middleStart + i * step]);
            }
        }

        // Take last sentence if we have more than 1 target sentence
        if (targetSentences > 1) {
            selectedSentences.push(sentences[sentences.length - 1]);
        }
    }

    summary = selectedSentences.map(s => s.trim()).join('. ') + '.';
    const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
    const processingTime = (Date.now() - startTime) / 1000;

    return {
        summary,
        wordCount,
        processingTime: Math.round(processingTime * 100) / 100 // Round to 2 decimal places
    };
};

/**
 * Get API health status
 * @returns {Object}
 */
const getHealthStatus = (): {
    status: string;
    timestamp: string;
} => {
    return {
        status: 'healthy',
        timestamp: new Date().toISOString()
    };
};

export default {
    generateSummary,
    getHealthStatus
};
