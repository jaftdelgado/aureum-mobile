import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text';

import { ThemeIcon } from '@features/settings/resources/svg/ThemeIcon'; // Luna
import { SunIcon } from '@features/settings/resources/svg/SunIcon';     // Sol

export const AuthHeader = () => {
  const insets = useSafeAreaInsets();
  const { toggleTheme, isDark } = useTheme();
  const { i18n } = useTranslation();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50 flex-row justify-between px-6"
      style={{ paddingTop: insets.top + 10 }}
    >
      <TouchableOpacity 
        onPress={toggleTheme}
        className="h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-md"
      >
        {isDark ? (
          <SunIcon width={22} height={22} variant="warning" />
        ) : (
          <ThemeIcon width={22} height={22} variant="primary" />
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLanguageChange}
        className="h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-sm backdrop-blur-md"
      >
        <Text weight="bold" className="text-xs uppercase text-gray-700 dark:text-gray-200">
          {i18n.language}
        </Text>
      </TouchableOpacity>
    </View>
  );
};