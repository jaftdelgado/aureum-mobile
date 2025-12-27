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
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.538086097962-9dj1bc3g68smpvmkkce2co63iga0tfci" 
      }
    ]
  ],

  ios: {
    bundleIdentifier: 'com.cesar.aureum',
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist", 
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false, 
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true,
      },
      LSApplicationQueriesSchemes: [
        "google",
        "com.googleusercontent.apps.538086097962-9dj1bc3g68smpvmkkce2co63iga0tfci"
      ]
    },
  },

  android: {
    package: 'com.cesar.aureum',
    adaptiveIcon: {
      backgroundColor: '#ffffff',
    },
    googleServicesFile: "./google-services.json", 
    permissions: [
      "android.permission.INTERNET"
    ]
  },

  extra: {
    ...config.extra,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    eas: {
      projectId: '41a117aa-682c-4aaa-b0fc-59ae96e48b8f',
    },
  },
});