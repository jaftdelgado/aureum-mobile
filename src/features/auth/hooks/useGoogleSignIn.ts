import { useState } from 'react';
import { Alert, Platform } from 'react-native';
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

      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: false, 
          },
        });
        if (error) throw error;
        return;
      }

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
      if (Platform.OS !== 'web') {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    handleGoogleLogin,
  };
};