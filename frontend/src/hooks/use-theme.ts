import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Check for saved theme in localStorage or default to light
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                return savedTheme;
            }

            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }

        return 'light';
    });

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);

        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);

            // Apply theme to document
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
        }
    };

    // Apply theme on mount and when theme changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
                // Only update if no theme is saved in localStorage
                const savedTheme = localStorage.getItem('theme');
                if (!savedTheme) {
                    setThemeState(e.matches ? 'dark' : 'light');
                }
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    return {
        theme,
        setTheme,
        isDark: theme === 'dark',
        isLight: theme === 'light'
    };
};
