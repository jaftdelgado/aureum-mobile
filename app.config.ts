import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'aureum-mobile',
  slug: 'aureum-mobile',
  scheme: 'aureum',
  version: '1.0.0',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  plugins: [
    ...(config.plugins || []), 
    'expo-web-browser',
    'expo-secure-store',
    'expo-font',         
    'expo-localization', 
    [
      'expo-image-picker',
      {
        photosPermission: "Permitir acceso a fotos para subir imágenes.",
        cameraPermission: "Permitir acceso a la cámara para tomar fotos."
      },
    ],
  ],

  ios: {
    bundleIdentifier: 'com.jaftdelgado.aureum',
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false, 
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
    },
  },

  android: {
    package: 'com.jaftdelgado.aureum',
    adaptiveIcon: {
      backgroundColor: '#ffffff',
    },
  },

  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: '6ee985c4-cbdf-4b13-acf1-fa8116388523',
    },
  },
});
