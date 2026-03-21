'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_BACKDROP_ID, DEFAULT_COLOR_SCHEME_ID } from '@/lib/themes';

interface ThemeContextType {
  colorScheme: string;
  backdropId: string;
  setColorScheme: (id: string) => void;
  setBackdropId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState(DEFAULT_COLOR_SCHEME_ID);
  const [backdropId, setBackdropIdState] = useState(DEFAULT_BACKDROP_ID);

  // Apply color scheme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, [colorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        backdropId,
        setColorScheme: setColorSchemeState,
        setBackdropId: setBackdropIdState,
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
