import React from 'react';
import { View } from 'react-native';
import { Button } from '@core/ui/Button';
import { useTranslation } from 'react-i18next';
import { GoogleLogo } from '@resources/svg/GoogleLogo';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn'; // <--- Importamos

export const GoogleSignIn = () => {
  const { t } = useTranslation();
  const { handleGoogleLogin, loading } = useGoogleSignIn();

  return (
    <View className="w-full my-2">
      <Button 
        title={loading ? t("common.loading") : t("signin.continueWithGoogle")}
        variant="outline"
        className="border-gray-300 bg-white"
        textClassName="text-gray-700 font-medium"
        onPress={handleGoogleLogin}
        loading={loading}
        leftIcon={<GoogleLogo width={20} height={20} />}
      />
    </View>
  );
};