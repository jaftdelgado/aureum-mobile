import { useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../../infra/external/supabase';
import { useTranslation } from 'react-i18next';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
  const { t } = useTranslation('auth');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectUrl = makeRedirectUri({
        scheme: 'aureum',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          const params = new URLSearchParams(result.url.split('#')[1]);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Error Google:", error);
      Alert.alert(t("common.error"), error.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleLogin,
  };
};