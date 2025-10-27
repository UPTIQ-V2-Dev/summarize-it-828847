export interface SummaryRequest {
    text: string;
    options?: {
        length: 'short' | 'medium' | 'long';
    };
}

export interface SummaryResponse {
    summary: string;
    wordCount: number;
    processingTime: number;
}

export interface SummaryFormData {
    text: string;
    length: 'short' | 'medium' | 'long';
}

export type SummaryLength = 'short' | 'medium' | 'long';

export interface TextStats {
    characterCount: number;
    wordCount: number;
    paragraphCount: number;
}

export interface SummaryError {
    message: string;
    code: string;
    details?: string;
}
