import { Moon, Sun, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

export const Header = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-16 items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                        <FileText className='h-5 w-5' />
                    </div>
                    <div>
                        <h1 className='text-xl font-bold tracking-tight'>SummaryGen</h1>
                        <p className='text-xs text-muted-foreground'>AI-Powered Text Summarization</p>
                    </div>
                </div>

                <Button
                    variant='ghost'
                    size='icon'
                    onClick={toggleTheme}
                    className='h-10 w-10'
                    aria-label='Toggle theme'
                >
                    <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                </Button>
            </div>
        </header>
    );
};
