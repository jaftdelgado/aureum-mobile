import { useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@infra/external/supabase';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      const redirectTo = 'aureum://google-auth';

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === 'success' && result.url) {
        const getParam = (key: string) => {
          const regex = new RegExp(`[#?&]${key}=([^&]*)`);
          const match = result.url.match(regex);
          return match ? match[1] : undefined;
        };

        const accessToken = getParam('access_token');
        const refreshToken = getParam('refresh_token');

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) throw sessionError;
        } else {
          Alert.alert('Error', 'No se pudieron obtener las credenciales de la sesión.');
        }
      }
    } catch (error: any) {
      Alert.alert(
        'Error de Autenticación',
        error.message || 'No se pudo completar el inicio de sesión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    loading,
  };
};
