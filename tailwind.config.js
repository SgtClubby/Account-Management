/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "metrix-blue": "#6094c6",
        "metrix-blue-hover": "#4a7aa8",
        "metrix-blue-background": "#213445",
      },
      screens: {
        'small': { 'raw': 'screen and (max-height: 870px)' },
      },
    },
  },
  plugins: [],
};
