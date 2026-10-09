'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const THEMES = [
  { id: 'nature', name: 'Nature & Agro (Default)', primary: '#15803d', accent: '#ca8a04' },
  { id: 'luxury', name: 'Luxury Forest & Gold', primary: '#1e3a2f', accent: '#d4af37' },
  { id: 'earth', name: 'Warm Terracotta & Olive', primary: '#c25e2e', accent: '#3f6212' },
  { id: 'ocean', name: 'Coastal Teal & Sky', primary: '#0f766e', accent: '#0284c7' },
];

const ThemeContext = createContext({
  theme: 'nature',
  setTheme: () => {},
  availableThemes: THEMES,
});

export function ThemeProvider({ children, initialTheme = 'nature' }) {
  const [theme, setThemeState] = useState(initialTheme);

  useEffect(() => {
    // Check saved user preference from localStorage
    const saved = localStorage.getItem('wn_theme');
    if (saved && THEMES.some((t) => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, [initialTheme]);

  const setTheme = (newTheme) => {
    if (THEMES.some((t) => t.id === newTheme)) {
      setThemeState(newTheme);
      localStorage.setItem('wn_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
