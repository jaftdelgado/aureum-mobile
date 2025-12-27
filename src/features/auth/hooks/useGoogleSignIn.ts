import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { useAuth } from '@app/providers/AuthProvider';
import { set } from 'zod';

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth(); 

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      
      offlineAccess: true, 
      
      forceCodeForRefreshToken: true,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      const userInfo = await GoogleSignin.signIn();
      
      const token = userInfo.data?.idToken;

      if (token) {
        await googleLogin(token);
      } else {
        throw new Error('No se pudo obtener el token de Google');
      }

    } catch (error: any) {
      setLoading(false);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('Login cancelado por el usuario');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Login ya en curso');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Google Play Services no está disponible');
            break;
          default:
            console.error('Error nativo:', error);
            Alert.alert('Error', 'No se pudo conectar con Google');
        }
      } else {
        console.error('Error general:', error);
        Alert.alert('Error', 'Error de autenticación');
      }
    } 
  };

  return {
    handleGoogleSignIn,
    loading,
  };
};