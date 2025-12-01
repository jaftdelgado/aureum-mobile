import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadResources } from './loadResources';
import languageDetector from './languageDetector';

i18n.use(languageDetector).use(initReactI18next).init({
  resources: loadResources(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false 
  }
});

export default i18n;
