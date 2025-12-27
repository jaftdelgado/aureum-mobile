import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { GoogleLogo } from '../../../resources/svg/GoogleLogo'; 
import { Text } from '@core/ui/Text';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';

export const GoogleSignIn = () => {
  const { handleGoogleSignIn, loading } = useGoogleSignIn();

  return (
    <TouchableOpacity 
      onPress={handleGoogleSignIn}
      disabled={loading}
      className="flex-row items-center justify-center bg-white border border-gray-200 rounded-xl py-3.5 px-4 shadow-sm active:bg-gray-50"
    >
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <>
          <GoogleLogo width={20} height={20} />
          <Text weight="semibold" className="ml-3 text-gray-700">
            Continuar con Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};