import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['Outfit', 'sans-serif'],
            },
            colors: {
                forest: {
                    900: '#3A4A3A',
                    800: '#4A5D4A',
                    700: '#5A6D5A',
                },
                sage: {
                    50: '#f0f5ee',
                    100: '#e0eadc',
                    200: '#c5d6be',
                    300: '#A3B88C',
                    400: '#8FA67A',
                    500: '#7A9468',
                }
            },
            animation: {
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [
        typography,
    ],
}
