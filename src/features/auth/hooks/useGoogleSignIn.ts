import { useState } from 'react';
import { Alert} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../../infra/external/supabase';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
  const { t } = useTranslation('auth');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected === false) {
        throw new Error("No hay conexión a internet. Verifique su red.");
      }

      const redirectUrl = makeRedirectUri({
        scheme: 'aureum',
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, 
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        },
      });

      if (error) throw error;

      if (data?.url) {
        let authUrl = data.url;

        if (authUrl.includes('prompt=')) {
           authUrl = authUrl.replace(/prompt=[^&]+/, 'prompt=select_account');
        } else {
           const separator = authUrl.includes('?') ? '&' : '?';
           authUrl = `${authUrl}${separator}prompt=select_account`;
        }

        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
        
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