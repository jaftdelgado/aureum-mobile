import { useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import NetInfo from '@react-native-community/netinfo';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleSignIn = () => {
  const { t } = useTranslation('auth');
  const { loginWithGoogle } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const networkState = await NetInfo.fetch();
      if (networkState.isConnected === false) {
        throw new Error(t("common.noInternet")); 
      }

      await loginWithGoogle();

    } catch (error: any) {
      console.error("Error Google:", error);
      Alert.alert(t("common.error"), error.message || t("common.genericLoginError"));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleLogin,
  };
};