import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'blue': {
          400: '#60A5FA',  
          500: '#3B82F6',  
          600: '#2563EB',  
          700: '#1D4ED8',  
        },
        'purple': {
          500: '#8B5CF6',  
        },
        'gray': {
          100: '#F3F4F6',  
          300: '#D1D5DB',  
          600: '#4B5563',  
          700: '#374151',  
          800: '#1F2937',  
          900: '#111827',  
        },
        'white': '#FFFFFF',
        'black': '#000000',
        'red': {
          600: '#DC2626',  
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config