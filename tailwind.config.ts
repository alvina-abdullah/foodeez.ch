import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Foodeez Custom Colors ===

        // 🍓 Primary Brand Color - for buttons, links, highlights
        primary: {
          DEFAULT: '#EF4444',       // Crimson Red
          light: '#F87171',
          dark: '#DC2626',
        },

        // 🥑 Secondary Color - for success messages, accents
        secondary: {
          DEFAULT: '#10B981',       // Avocado Green
          light: '#34D399',
          dark: '#059669',
        },

        // 🍊 Accent - for food ratings, highlights
        accent: {
          DEFAULT: '#F97316',       // Tangy Orange
          light: '#FDBA74',
          dark: '#C2410C',
        },

        // 🧂 Text Colors
        text: {
          main: '#1F2937',          // Slate-900
          muted: '#6B7280',         // Slate-500
          light: '#9CA3AF',         // Slate-400
        },

        // 🍚 Background Colors
        background: {
          DEFAULT: '#FFFDFB',       // Soft White
          card: '#F3F4F6',          // Light Warm Gray
          muted: '#E5E7EB',         // Light Gray for hover states etc.
        },

        // 🌶️ Danger/Warning/Error Colors
        danger: {
          DEFAULT: '#DC2626',       // Bright Red
          light: '#F87171',
          dark: '#991B1B',
        },

        // 🟢 Status Colors
        success: '#22C55E',         // Success
        warning: '#EAB308',         // Warning

        // 🌀 Neutral Grays
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};

export default config;
