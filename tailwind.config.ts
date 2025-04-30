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
          DEFAULT: '#EF4444',     // Crimson Red
          light: '#F87171',       // Light Red
          dark: '#DC2626',        // Dark Red
          50: '#FEF2F2',          // Very light red (backgrounds)
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',         // Same as DEFAULT
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A'          // Almost black with red tint
        },

        // 🥑 Secondary Color - for success messages, accents
        secondary: {
          DEFAULT: '#10B981',     // Avocado Green
          light: '#34D399',       // Lighter green
          dark: '#059669',        // Darker green
          50: '#ECFDF5',         // Very light green
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',         // Same as DEFAULT
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22'          // Very dark green
        },


        // 🍊 Accent - for food ratings, highlights
        accent: {
          DEFAULT: '#F97316',       // Tangy Orange
          light: '#FDBA74',         // Light orange
          dark: '#C2410C',          // Deep orange
          50: '#FFF7ED',           // Very light peach
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',           // Same as DEFAULT
          600: '#EA580C',
          700: '#C2410C',           // Same as dark
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407'            // Almost burnt orange
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
