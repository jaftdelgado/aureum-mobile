import React, { createContext, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@core/design/colors';
import { useColorScheme } from 'nativewind';

const THEME_STORAGE_KEY = '@aureum_theme';

type ThemeContextType = {
  theme: typeof colors.light;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setColorScheme(savedTheme);
        }
      } catch (error) {
        console.log('Error loading theme:', error);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    toggleColorScheme();
    
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const isDark = colorScheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
};