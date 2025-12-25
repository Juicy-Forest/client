/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      keyframes: {
        'typing-bounce': {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.7',
          },
          '30%': {
            transform: 'translateY(-6px)',
            opacity: '1',
          },
        },
      },
      animation: {
        'typing-bounce': 'typing-bounce 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

