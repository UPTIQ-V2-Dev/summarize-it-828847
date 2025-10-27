import { summaryService } from '../services/index.ts';
import { MCPTool } from '../types/mcp.ts';
import { z } from 'zod';

const summaryResponseSchema = z.object({
    summary: z.string(),
    wordCount: z.number(),
    processingTime: z.number()
});

const healthResponseSchema = z.object({
    status: z.string(),
    timestamp: z.string()
});

const generateSummaryTool: MCPTool = {
    id: 'summary_generate',
    name: 'Generate Text Summary',
    description: 'Generate a summary of provided text with configurable length',
    inputSchema: z.object({
        text: z.string().min(1).max(10000),
        length: z.enum(['short', 'medium', 'long']).optional().default('medium')
    }),
    outputSchema: summaryResponseSchema,
    fn: async (inputs: { text: string; length?: string }) => {
        const result = await Promise.resolve(summaryService.generateSummary(inputs.text, inputs.length || 'medium'));
        return result;
    }
};

const getHealthTool: MCPTool = {
    id: 'summary_health',
    name: 'Check API Health',
    description: 'Check the health status of the summary API service',
    inputSchema: z.object({}),
    outputSchema: healthResponseSchema,
    fn: async () => {
        const result = await Promise.resolve(summaryService.getHealthStatus());
        return result;
    }
};

export const summaryTools: MCPTool[] = [generateSummaryTool, getHealthTool];
