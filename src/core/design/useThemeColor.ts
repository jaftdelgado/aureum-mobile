import { useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { colors } from '@core/design/colors';

export function useThemeColor(token: keyof typeof colors.light): string {
  const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const listener = ({ colorScheme }: { colorScheme: ColorSchemeName }) => setScheme(colorScheme);
    const subscription = Appearance.addChangeListener(listener);
    return () => subscription.remove();
  }, []);

  return scheme === 'light' ? (colors.dark[token] ?? colors.light[token]) : colors.light[token];
}
