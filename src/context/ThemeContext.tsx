/**
 * Theme Context for dark mode support
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  error: string;
}

interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5EA',
    primary: '#007AFF',
    error: '#FF3B30',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    border: '#38383A',
    primary: '#0A84FF',
    error: '#FF453A',
  },
};

interface ThemeContextType extends Theme {
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@weather_app:theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const preference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (preference !== null) {
          setIsDark(preference === 'dark');
        } else {
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        setIsDark(systemColorScheme === 'dark');
      }
    };
    loadThemePreference();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    ...theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
