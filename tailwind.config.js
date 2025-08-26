import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        "./src/**/*.{js,jsx,ts,tsx,mdx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', ...defaultTheme.fontFamily.sans],
                Lora: ['Lora'],
            },
            colors: {
                vulcan: {
                    25: '#fafafa',
                    50: '#f5f5f6',
                    100: '#f0f1f1',
                    200: '#ececed',
                    300: '#cecfd2',
                    400: '#94969c',
                    500: '#85888e',
                    600: '#61646c',
                    700: '#333741', // Primary
                    800: '#1f242f', 
                    900: '#161b26',
                    950: '#0c111d',
                    
                },
                warning:{
                    25: '#fffefb',
                    50: '#fefaec',
                    100: '#fbf1ca',
                    200: '#f6e291',
                    300: '#f2ce57',
                    400: '#efba30',
                    500: '#e79b19',
                    600: '#cd7612',
                    700: '#aa5413',
                    800: '#8a4216', 
                    900: '#723715',
                    950: '#431c07',
                },
                error: {
                    25: '#fef9fa',
                    50: '#fff0f2',
                    100: '#ffdde1',
                    200: '#ffc1c9',
                    300: '#ff96a3',
                    400: '#ff5a6f',
                    500: '#ff2742',
                    600: '#fb0726',
                    700: '#d4011c',
                    800: '#ae061b', 
                    900: '#900c1d',
                    950: '#4f000a',
                },
                success: {
                    25: '#fbfff8',
                    50: '#efffe5',
                    100: '#d9ffc7',
                    200: '#b5ff96',
                    300: '#86fc5a',
                    400: '#5cf328',
                    500: '#3bd909',
                    600: '#29ae02',
                    700: '#218407',
                    800: '#1f680c', 
                    900: '#1b580f',
                    950: '#093102',
                },
                information: {
                    25: '#f6f9fb',
                    50: '#edf7ff',
                    100: '#d6ecff',
                    200: '#b7dfff',
                    300: '#85ccff',
                    400: '#4cafff',
                    500: '#228bff',
                    600: '#0b6aff',
                    700: '#0452f1',
                    800: '#0b43c2', 
                    900: '#103c98',
                    950: '#0f265c',
                },
                others: {
                    red: '#ff3b30',
                    orange: '#ff9500',
                    yellow: '#ffcc00',
                    green: '#34c759',
                    mint: '#00c7be',
                    teal: '#30b0c7',
                    blue: '#007aff',
                    indigo: '#5856d6',
                    purple: '#af52de',
                    pink: '#ff2d55', 
                    brown: '#a2845e',
                    white: '#ffffff',
                },
            },
            boxShadow: {
                'card': '0px 1px 15.4px 0px rgba(26, 29, 33, 0.05)',
                'button': '0px 4px 16.5px 0px rgba(25, 25, 25, 0.11), 0px 1px 8.9px 0px rgba(0, 0, 0, 0.16)',
                'statistic': '1px 1px 1px 0 rgba(105, 105, 105, 0.25) inset'
            }
        },
        fontSize: {
            // Manrope
            'xss': ['10px', {
                lineHeight: '16px'
            }],
            'xs': ['12px', {
                lineHeight: '18px'
            }],
            'sm': ['14px', {
                lineHeight: '20px'
            }],
            'base': ['16px', {
                lineHeight: '22px'
            }],
            // Lora
            'lg': ['20px', {
                lineHeight: '26px'
            }],
            'xl': ['24px', {
                lineHeight: '30px'
            }],
            '2xl': ['28px', {
                lineHeight: '34px'
            }],
            '3xl': ['32px', {
                lineHeight: '38px'
            }],
        },
        borderRadius: {
            'none': '0',
            'sm': '2px',
            DEFAULT: '4px',
            'md': '0.375rem',
            'lg': '0.5rem',
            'full': '9999px',
            'large': '12px',
        },
        screens: {
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        }
    },

    plugins: [forms],
};
