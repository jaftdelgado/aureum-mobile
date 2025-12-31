import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next'; 
import { GoogleLogo } from '../../../resources/svg/GoogleLogo'; 
import { Text } from '@core/ui/Text';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { useTheme } from '@app/providers/ThemeProvider';

export const GoogleSignIn = () => {
  const { handleGoogleLogin, loading } = useGoogleSignIn();
  const { isDark } = useTheme();
  const { t } = useTranslation('auth'); 

  return (
    <TouchableOpacity 
      onPress={handleGoogleLogin}
      disabled={loading}
      className={`flex-row items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 px-4 shadow-sm active:bg-gray-50 dark:active:bg-slate-700 ${loading ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isDark ? "#FFFFFF" : "#000000"} />
      ) : (
        <>
          <GoogleLogo width={20} height={20} />
          <Text weight="semibold" className="ml-3 text-gray-700 dark:text-gray-200">
            {t('signin.google')} 
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};