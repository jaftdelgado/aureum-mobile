import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../../../infra/external/supabase';
import { Button } from '@core/ui/Button';
import { GoogleLogo } from '@resources/svg/GoogleLogo';

WebBrowser.maybeCompleteAuthSession();

export const GoogleSignIn = () => {

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = makeRedirectUri({
      scheme: 'aureum',
      path: 'auth/callback',
    });
    console.log("Redirect URL:", redirectUrl); 

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, 
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

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
      Alert.alert("Error", error.message || "No se pudo iniciar sesión con Google");
    }
  };

  return (
    <View className="w-full my-2">
      <Button 
        title="Continuar con Google" 
        variant="outline" 
        className="border-gray-300 bg-white"
        textClassName="text-gray-700"
        onPress={handleGoogleLogin}
        leftIcon={<GoogleLogo width={20} height={20} />}
      />
    </View>
  );
};