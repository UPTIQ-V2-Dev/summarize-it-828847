import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { SummaryLayout } from '@/components/summary/SummaryLayout';
import { SummaryGeneratorForm } from '@/components/summary/SummaryGeneratorForm';
import { SummaryDisplay } from '@/components/summary/SummaryDisplay';
import { useSummaryGeneration } from '@/hooks/useSummaryGeneration';
import type { SummaryLength, SummaryRequest } from '@/types/summary';

export const SummaryPage = () => {
    const [lastRequest, setLastRequest] = useState<SummaryRequest | null>(null);

    const { generateSummary, isLoading, data: summaryData, error: summaryError, resetSummary } = useSummaryGeneration();

    const handleGenerateSummary = ({ text, length }: { text: string; length: SummaryLength }) => {
        const request: SummaryRequest = {
            text,
            options: { length }
        };

        setLastRequest(request);
        generateSummary(request);
    };

    const handleRetry = () => {
        if (lastRequest) {
            resetSummary();
            generateSummary(lastRequest);
        }
    };

    return (
        <div className='min-h-screen bg-background'>
            <Header />

            <main className='flex-1'>
                <SummaryLayout>
                    <SummaryGeneratorForm
                        onSubmit={handleGenerateSummary}
                        isLoading={isLoading}
                    />

                    <SummaryDisplay
                        summary={summaryData}
                        isLoading={isLoading}
                        error={summaryError}
                        onRetry={handleRetry}
                    />
                </SummaryLayout>
            </main>
        </div>
    );
};
