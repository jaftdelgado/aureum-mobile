import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { colors } from '@core/design/colors';

type ThemeContextType = {
  theme: typeof colors.light;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const isDark = scheme === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return <ThemeContext.Provider value={{ theme, isDark }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return context;
};
