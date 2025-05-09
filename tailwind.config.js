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
                    700: '#333741',
                    800: '#1f242f', 
                    900: '#161b26',
                    950: '#0c111d',
                    
                },
                error: {
                    300: '#FF96A3',
                    800: '#ae061b',
                    700: '#d4011c',
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
            },
            boxShadow: {
                'card': '0px 1px 15.4px 0px rgba(26, 29, 33, 0.05)',
                'button': '0px 4px 16.5px 0px rgba(25, 25, 25, 0.11), 0px 1px 8.9px 0px rgba(0, 0, 0, 0.16)',
            }
        },
        screens: {
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        }
    },

    plugins: [forms],
};
