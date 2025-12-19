import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'aureum-mobile',
  slug: 'aureum-mobile',
  scheme: 'aureum',
  version: '1.0.0',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  plugins: [...(config.plugins || []), 'expo-web-browser'],

  ios: {
    bundleIdentifier: 'com.jaftdelgado.aureum',
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false, // ya tenías esto
      // ✅ Permitir cualquier carga de URL remota (para debug/testing)
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },

  android: {
    package: 'com.jaftdelgado.aureum',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },

  extra: {
    ...config.extra,
    ASSETS_API_URL: process.env.ASSETS_API_URL,
    eas: {
      projectId: '6ee985c4-cbdf-4b13-acf1-fa8116388523',
    },
  },
});
