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
                brown: {
                    900: '#1C1917',
                    800: '#292524',
                    700: '#44403c',
                },
                amber: {
                    50: '#FFF8E1',
                    100: '#FFECB3',
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
