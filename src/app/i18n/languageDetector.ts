import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { LanguageDetectorAsyncModule } from 'i18next';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: (callback) => {
    AsyncStorage.getItem(STORE_LANGUAGE_KEY)
      .then((language) => {
        if (language) {
          return callback(language);
        }
        const bestLanguage = Localization.getLocales()[0]?.languageCode ?? 'es';
        return callback(bestLanguage);
      })
      .catch((error) => {
        console.error('Error leyendo idioma', error);
        callback('es');
      });
  },
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.error('Error guardando idioma', error);
    }
  },
};

export default languageDetector;