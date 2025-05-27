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

        // 🍔 Primary Brand Color - Bold & Energetic Orange-Red
        primary: {
          DEFAULT: '#FF4D00',
          light: '#FF7A33',
          dark: '#CC3A00',
        },

        // 🥦 Secondary - Zesty Orange
        secondary: {
          DEFAULT: '#F87C1D',
          light: '#FDA75D',
          dark: '#C65F10',
        },

        // 🟤 Accent - Rich Brown for depth & flavor
        accent: {
          DEFAULT: '#733500',
          light: '#9E5C2A',
          dark: '#4A1F00',
        },

        // 🌟 Highlight - Golden for Ratings, Offers
        highlight: {
          DEFAULT: '#EEA40D',
          light: '#F9C449',
          dark: '#C47C00',
        },

        // 🧂 Text Colors
        text: {
          main: '#1F2937',   // Slate-900
          muted: '#6B7280',  // Slate-500
          light: '#9CA3AF',  // Slate-400
        },

        // 🍚 Background Colors
        background: {
          DEFAULT: '#FFFDFB',     // Soft white
          card: '#F3F4F6',        // Light gray for cards
          muted: '#E5E7EB',       // For subtle sections
        },

        // 🌶️ Danger Colors
        danger: {
          DEFAULT: '#DC2626',
          light: '#F87171',
          dark: '#991B1B',
        },

        // 🟢 Status Colors
        success: '#22C55E',
        warning: '#EAB308',

        // ⚫ Neutral Grays
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
