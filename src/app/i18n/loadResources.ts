export function loadResources() {
  return {
    es: {
      app: require('@app/i18n/locales/es.json'),
      teams: require('@features/teams/i18n/es.json'),
      settings: require('@features/settings/i18n/es.json'),
    },
    en: {
      app: require('@app/i18n/locales/en.json'),
      teams: require('@features/teams/i18n/en.json'),
      settings: require('@features/settings/i18n/en.json'),
    },
  };
}
