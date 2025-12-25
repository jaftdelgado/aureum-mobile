export const ENV = {
  ASSETS_API_URL: process.env.EXPO_PUBLIC_API_GATEWAY_URL || '', 
  API_GATEWAY_URL: process.env.EXPO_PUBLIC_API_GATEWAY_URL,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

if (!ENV.API_GATEWAY_URL) {
  console.warn("⚠️ Advertencia: EXPO_PUBLIC_API_GATEWAY_URL no está definida.");
}