import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
    title?: string;
    message: string;
    variant?: 'default' | 'destructive';
    onRetry?: () => void;
    retryLabel?: string;
    className?: string;
}

export const ErrorMessage = ({
    title = 'Error',
    message,
    variant = 'destructive',
    onRetry,
    retryLabel = 'Try Again',
    className
}: ErrorMessageProps) => {
    return (
        <Alert
            variant={variant}
            className={cn('', className)}
        >
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex flex-col gap-3'>
                <div>
                    <div className='font-medium'>{title}</div>
                    <div className='text-sm'>{message}</div>
                </div>
                {onRetry && (
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={onRetry}
                        className='w-fit'
                    >
                        <RefreshCw className='mr-2 h-4 w-4' />
                        {retryLabel}
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
};
