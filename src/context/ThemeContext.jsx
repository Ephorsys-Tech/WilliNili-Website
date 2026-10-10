'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const THEME = {
  id: 'willy-nilly',
  name: 'Willy Nilly Brand (Forest Green & Gold)',
  primary: '#0e3d2b',
  accent: '#c59b27',
};

const ThemeContext = createContext({
  theme: 'willy-nilly',
  setTheme: () => {},
  availableThemes: [THEME],
});

export function ThemeProvider({ children }) {
  const [theme] = useState('willy-nilly');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'willy-nilly');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => {}, availableThemes: [THEME] }}>
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
