import { type ZodSchema, z } from 'zod';

type TriggerEvent =
    | {
          type: 'async';
          name: string;
          description: string;
      }
    | {
          type: 'sync';
          name: string;
          description: string;
          outputSchema: ZodSchema;
      };

export type AgentConfig = {
    id: string;
    name: string;
    description: string;
    triggerEvents: TriggerEvent[];
    config: {
        appId: string;
        accountId: string;
        widgetKey: string;
    };
};

export const AGENT_CONFIGS: AgentConfig[] = [
    {
        id: 'f08a04f2-a317-4e14-a680-8233fa280d23',
        name: 'Summary Generator Agent',
        description: 'An AI agent designed to generate concise summaries from text inputs.',
        triggerEvents: [
            {
                type: 'sync',
                name: 'Original Text Input textbox',
                description:
                    'user can enter row data in Original Text Input then should be input for agent "Summary Provider Agent" and provide output in Generated Summary.',
                outputSchema: z.object({
                    summary: z.string().describe('The generated summary text')
                })
            }
        ],
        config: {
            appId: '48a530c1-f7cb-4379-a062-a1d9fe63452e',
            accountId: '8e995c40-0262-4eea-835e-9b4f146424ef',
            widgetKey: 'u6AUQ2rWeanjg9IzAkh2f9iBLZB7EicNGDajgPaP'
        }
    }
];
