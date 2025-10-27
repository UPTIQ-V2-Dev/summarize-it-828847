import type { PaginatedResponse } from '@/types/api';
import type { AuthResponse, User } from '@/types/user';
import type { SummaryResponse } from '@/types/summary';

export const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'USER',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockAdminUser: User = {
    id: 2,
    email: 'admin@example.com',
    name: 'Jane Smith',
    role: 'ADMIN',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockAuthResponse: AuthResponse = {
    user: mockUser,
    tokens: {
        access: {
            token: 'mock-access-token',
            expires: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        },
        refresh: {
            token: 'mock-refresh-token',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    }
};

export const mockPaginatedUsers: PaginatedResponse<User> = {
    results: mockUsers,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 2
};

// Mock data for summary generation
export const mockSummaryResponses: Record<string, SummaryResponse> = {
    short: {
        summary:
            'This is a concise summary highlighting the key points of your input text. The main ideas have been condensed into essential information while maintaining the original context and meaning.',
        wordCount: 28,
        processingTime: 1.2
    },
    medium: {
        summary:
            'This is a moderately detailed summary that captures the essential points of your input text. It provides a balanced overview of the main ideas, key concepts, and important details while maintaining readability. The summary preserves the core message and context, ensuring that readers can quickly understand the fundamental aspects of the original content without getting overwhelmed by unnecessary details.',
        wordCount: 65,
        processingTime: 1.8
    },
    long: {
        summary:
            'This is a comprehensive and detailed summary that thoroughly covers all significant aspects of your input text. It includes the main ideas, supporting details, key concepts, and contextual information that help provide a complete understanding of the original content. The summary maintains the structure and flow of the original text while condensing it into a more digestible format. This approach ensures that readers receive a thorough overview of the subject matter, including nuanced points and secondary information that contribute to a fuller comprehension of the topic. The detailed nature of this summary makes it particularly useful for academic, professional, or analytical purposes where comprehensive understanding is essential.',
        wordCount: 128,
        processingTime: 2.5
    }
};

export const mockSampleTexts: string[] = [
    'Climate change is one of the most pressing issues of our time, affecting weather patterns, sea levels, and ecosystems worldwide. Scientists agree that human activities, particularly the emission of greenhouse gases, are the primary drivers of current climate change. The effects include rising global temperatures, melting ice caps, and more frequent extreme weather events. Immediate action is needed to reduce carbon emissions and transition to renewable energy sources to mitigate these impacts.',
    'Artificial Intelligence has revolutionized various industries by automating complex tasks and providing data-driven insights. Machine learning algorithms can now process vast amounts of information to identify patterns and make predictions. From healthcare to finance, AI applications are improving efficiency and accuracy. However, the rapid advancement of AI technology also raises concerns about job displacement and ethical considerations that need to be addressed.',
    'The human brain is a remarkable organ composed of billions of neurons that communicate through electrical and chemical signals. This complex network enables consciousness, memory, learning, and decision-making. Recent advances in neuroscience have revealed how different brain regions work together to process information and generate thoughts. Understanding brain function is crucial for developing treatments for neurological disorders and enhancing human cognitive capabilities.'
];
