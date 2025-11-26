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
    plugins: [
    ...(config.plugins || []), 
    "expo-web-browser"
    ],
    extra: {
      ASSETS_API_URL: process.env.ASSETS_API_URL,
    },
});