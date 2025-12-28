import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

const LANGUAGE_STORAGE_KEY = '@aureum_language';

export const languageDetector: any = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        return callback(savedLanguage);
      }
    } catch (error) {
      console.log('Error reading language', error);
    }

    const bestLanguage = Localization.getLocales()[0]?.languageCode || 'es';
    callback(bestLanguage);
  },
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language', error);
    }
  },
};