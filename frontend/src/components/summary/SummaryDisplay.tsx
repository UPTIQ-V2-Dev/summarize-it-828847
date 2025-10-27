import { FileText, Clock, Hash, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CopyButton } from '@/components/common/CopyButton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatProcessingTime } from '@/utils/textUtils';
import type { SummaryResponse, SummaryError } from '@/types/summary';

interface SummaryDisplayProps {
    summary?: SummaryResponse | null;
    isLoading: boolean;
    error?: SummaryError | null;
    onRetry?: () => void;
}

export const SummaryDisplay = ({ summary, isLoading, error, onRetry }: SummaryDisplayProps) => {
    const handleExportText = () => {
        if (!summary?.summary) return;

        const blob = new Blob([summary.summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `summary-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportMarkdown = () => {
        if (!summary?.summary) return;

        const markdownContent = `# Summary

Generated on: ${new Date().toLocaleString()}

${summary.summary}

---

**Stats:**
- Word Count: ${summary.wordCount}
- Processing Time: ${formatProcessingTime(summary.processingTime)}
`;

        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `summary-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className='h-fit'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Generated Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {/* Loading State */}
                    {isLoading && (
                        <div className='space-y-3'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                            <div className='flex gap-2 pt-2'>
                                <Skeleton className='h-6 w-16' />
                                <Skeleton className='h-6 w-20' />
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !isLoading && (
                        <ErrorMessage
                            title='Summary Generation Failed'
                            message={error.message || 'Unable to generate summary. Please try again.'}
                            onRetry={onRetry}
                        />
                    )}

                    {/* Success State */}
                    {summary && !isLoading && !error && (
                        <div className='space-y-4'>
                            <div className='prose prose-sm dark:prose-invert max-w-none'>
                                <p className='text-foreground leading-relaxed whitespace-pre-wrap'>{summary.summary}</p>
                            </div>

                            {/* Summary Stats */}
                            <div className='flex flex-wrap gap-2 pt-2 border-t'>
                                <Badge
                                    variant='secondary'
                                    className='flex items-center gap-1'
                                >
                                    <Hash className='h-3 w-3' />
                                    {summary.wordCount} words
                                </Badge>
                                <Badge
                                    variant='secondary'
                                    className='flex items-center gap-1'
                                >
                                    <Clock className='h-3 w-3' />
                                    {formatProcessingTime(summary.processingTime)}
                                </Badge>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-wrap gap-2 pt-2'>
                                <CopyButton
                                    text={summary.summary}
                                    variant='outline'
                                    className='flex-1 sm:flex-none'
                                >
                                    Copy Summary
                                </CopyButton>

                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleExportText}
                                    className='flex items-center gap-2'
                                >
                                    <Download className='h-4 w-4' />
                                    Export TXT
                                </Button>

                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleExportMarkdown}
                                    className='flex items-center gap-2'
                                >
                                    <Download className='h-4 w-4' />
                                    Export MD
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!summary && !isLoading && !error && (
                        <div className='flex flex-col items-center justify-center py-12 text-center'>
                            <div className='rounded-full bg-muted p-3 mb-4'>
                                <FileText className='h-6 w-6 text-muted-foreground' />
                            </div>
                            <h3 className='text-lg font-medium mb-2'>No Summary Yet</h3>
                            <p className='text-sm text-muted-foreground max-w-sm'>
                                Enter some text in the input area and click "Generate Summary" to see the results here.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
