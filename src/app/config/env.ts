import Constants from 'expo-constants';

export const ENV = {
  ASSETS_API_URL: Constants.expoConfig?.extra?.ASSETS_API_URL as string,
  API_GATEWAY_URL: Constants.expoConfig?.extra?.API_GATEWAY_URL as string,
};
