import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/useClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
    text: string;
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
    showText?: boolean;
}

export const CopyButton = ({
    text,
    variant = 'outline',
    size = 'sm',
    className,
    children,
    showText = true
}: CopyButtonProps) => {
    const { copy, copied, error } = useClipboard({
        successDuration: 2000
    });

    const handleCopy = () => {
        copy(text);
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            disabled={!text}
            className={cn(
                'transition-all duration-200',
                copied && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
                className
            )}
            aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        >
            {copied ? (
                <Check className={cn('h-4 w-4', showText && 'mr-2')} />
            ) : (
                <Copy className={cn('h-4 w-4', showText && 'mr-2')} />
            )}

            {showText && <span>{copied ? 'Copied!' : children || 'Copy'}</span>}

            {error && <span className='sr-only'>Error: {error}</span>}
        </Button>
    );
};
