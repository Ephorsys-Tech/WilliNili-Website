/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
          light: "var(--color-secondary-light)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
        },
        bg: {
          DEFAULT: "var(--color-bg)",
          alt: "var(--color-bg-alt)",
          dark: "var(--color-bg-dark)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          card: "var(--color-surface-card)",
          muted: "var(--color-surface-muted)",
          border: "var(--color-border)",
        },
        content: {
          main: "var(--color-text-main)",
          muted: "var(--color-text-muted)",
          light: "var(--color-text-light)",
          inverted: "var(--color-text-inverted)",
        },
        status: {
          success: "var(--color-status-success)",
          warning: "var(--color-status-warning)",
          error: "var(--color-status-error)",
          info: "var(--color-status-info)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        theme: "var(--theme-radius)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevation: "var(--shadow-elevation)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
