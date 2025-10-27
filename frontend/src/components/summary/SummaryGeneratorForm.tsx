import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles, RotateCcw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { summaryFormSchema, type SummaryFormInput } from '@/utils/validationSchemas';
import { calculateTextStats, formatTextStats, isTextSummarizable } from '@/utils/textUtils';
import { mockSampleTexts } from '@/data/mockData';
import type { SummaryLength } from '@/types/summary';

interface SummaryGeneratorFormProps {
    onSubmit: (data: { text: string; length: SummaryLength }) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export const SummaryGeneratorForm = ({ onSubmit, isLoading, disabled }: SummaryGeneratorFormProps) => {
    const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(null);

    const form = useForm<SummaryFormInput>({
        resolver: zodResolver(summaryFormSchema),
        defaultValues: {
            text: '',
            length: 'medium'
        }
    });

    const watchedText = form.watch('text');
    const textStats = calculateTextStats(watchedText);
    const isSummarizable = isTextSummarizable(watchedText);

    const handleSubmit = (data: SummaryFormInput) => {
        onSubmit({
            text: data.text,
            length: data.length
        });
    };

    const handleClear = () => {
        form.reset();
        setSelectedSampleIndex(null);
    };

    const handleUseSample = (index: number) => {
        const sampleText = mockSampleTexts[index];
        form.setValue('text', sampleText);
        setSelectedSampleIndex(index);
    };

    return (
        <Card className='h-fit'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <FileText className='h-5 w-5' />
                    Original Text Input
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className='space-y-4'
                    >
                        <FormField
                            control={form.control}
                            name='text'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Text to Summarize</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Paste or type the text you want to summarize here...'
                                            className='min-h-[300px] resize-none'
                                            disabled={disabled}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Text Statistics */}
                        {textStats.wordCount > 0 && (
                            <div className='flex flex-wrap gap-2 text-sm text-muted-foreground'>
                                <Badge variant='secondary'>{formatTextStats(textStats)}</Badge>
                                {!isSummarizable && <Badge variant='destructive'>Too short to summarize</Badge>}
                            </div>
                        )}

                        {/* Sample Texts */}
                        <div className='space-y-2'>
                            <p className='text-sm font-medium'>Try a sample text:</p>
                            <div className='flex flex-wrap gap-2'>
                                {mockSampleTexts.map((_, index) => (
                                    <Button
                                        key={index}
                                        type='button'
                                        variant={selectedSampleIndex === index ? 'default' : 'outline'}
                                        size='sm'
                                        onClick={() => handleUseSample(index)}
                                        disabled={disabled}
                                        className='text-xs'
                                    >
                                        Sample {index + 1}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name='length'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Summary Length</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={disabled}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select summary length' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='short'>Short (1-2 sentences)</SelectItem>
                                            <SelectItem value='medium'>Medium (3-4 sentences)</SelectItem>
                                            <SelectItem value='long'>Long (5+ sentences)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex gap-2'>
                            <Button
                                type='submit'
                                disabled={!isSummarizable || isLoading || disabled}
                                className='flex-1'
                            >
                                {isLoading ? (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                ) : (
                                    <Sparkles className='mr-2 h-4 w-4' />
                                )}
                                {isLoading ? 'Generating...' : 'Generate Summary'}
                            </Button>

                            <Button
                                type='button'
                                variant='outline'
                                onClick={handleClear}
                                disabled={disabled}
                            >
                                <RotateCcw className='h-4 w-4' />
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
