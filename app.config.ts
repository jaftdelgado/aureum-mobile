import 'dotenv/config';

export default {
  expo: {
    name: 'aureum-mobile',
    slug: 'aureum-mobile',
    version: '1.0.0',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    extra: {
      ASSETS_API_URL: process.env.ASSETS_API_URL,
    },
  },
};
