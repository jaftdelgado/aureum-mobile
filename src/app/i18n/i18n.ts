import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadResources } from './loadResources';

i18n.use(initReactI18next).init({
  resources: loadResources(),
  //lng: Localization.getLocales()[0]?.languageCode ?? 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },

  lng: 'es',
});

export default i18n;
