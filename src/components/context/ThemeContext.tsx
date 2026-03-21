'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_BACKDROP_ID, DEFAULT_COLOR_SCHEME_ID, DEFAULT_MODE } from '@/lib/themes';

interface ThemeContextType {
  colorScheme: string;
  backdropId: string;
  mode: 'dark' | 'light';
  setColorScheme: (id: string) => void;
  setBackdropId: (id: string) => void;
  setMode: (mode: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState(DEFAULT_COLOR_SCHEME_ID);
  const [backdropId, setBackdropIdState] = useState(DEFAULT_BACKDROP_ID);
  const [mode, setModeState] = useState<'dark' | 'light'>(DEFAULT_MODE);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    if (mode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        backdropId,
        mode,
        setColorScheme: setColorSchemeState,
        setBackdropId: setBackdropIdState,
        setMode: setModeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
