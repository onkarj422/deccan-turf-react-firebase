import { createTheme } from '@mantine/core';
import purple from './purple';

export const theme = createTheme({
    colors: {
        purple,
    },
    autoContrast: true,
    shadows: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.45)',
        md: '0 2px 4px 0 rgba(0,0,0,0.55)',
        lg: '0 4px 8px 0 rgba(0,0,0,0.65)',
        xl: '0 8px 16px 0 rgba(0,0,0,0.75)',
        '2xl': '0 12px 24px 0 rgba(0,0,0,0.80)',
        '3xl': '0 16px 32px 0 rgba(0,0,0,0.85)',
    },
    defaultRadius: 'md',
    fontFamily: 'Inter Variable, sans-serif',
    headings: {
        fontFamily: 'Inter Variable, sans-serif',
        fontWeight: 'semibold',
    },
    lineHeights: {
        xs: '1.4',
        sm: '1.45',
        md: '1.55',
        lg: '1.6',
        xl: '1.65',
    },
    fontSmoothing: true,
});
