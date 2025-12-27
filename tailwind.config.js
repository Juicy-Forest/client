/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'bg-[#FFB3BA]',
    'bg-[#FFDFBA]',
    'bg-[#FFFFBA]',
    'bg-[#BAFFC9]',
    'bg-[#BAE1FF]',
    'bg-[#D5BAFF]',
    'bg-[#FFC9DE]',
    'bg-[#FFE7BA]',
    'bg-[#BAFFD9]',
    'bg-[#BFFFD9]',
  ],
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

