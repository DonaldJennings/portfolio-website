'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Always force dark mode, ignore any saved preferences
    setTheme('dark');
  }, []);

  useEffect(() => {
    // Always apply dark theme to document
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');

    // Don't save theme preference since we're forcing dark mode
  }, [theme]);

  const toggleTheme = () => {
    // Disable theme toggling - always stay dark
    // setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
