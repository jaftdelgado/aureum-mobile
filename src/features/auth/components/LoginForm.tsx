import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next'; 
import { Button } from '@core/ui/Button';
import { Separator } from '@core/ui/Separator';
import { Text } from '@core/ui/Text';      
import { TextField } from '@core/ui/TextField'; 
import { GoogleSignIn } from './GoogleSignIn';
import { useLoginForm } from '../hooks/useLoginForm';

interface LoginFormProps {
  onShowRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onShowRegister }) => {
  const { t } = useTranslation(); 
  
  const { 
    formData, 
    handleChange, 
    loading, 
    errors, 
    errorMsg, 
    handleSubmit 
  } = useLoginForm();

  return (
    <View className="p-6 bg-white rounded-xl w-full shadow-sm">
      <Text 
        type="title1" 
        weight="bold" 
        align="center" 
        className="mb-6"
      >
        {t('signin.title')}
      </Text>

      {errorMsg && (
        <View className="mb-4 bg-red-50 p-3 rounded-lg">
          <Text color="error" align="center" type="subhead">
            {errorMsg}
          </Text>
        </View>
      )}

      <View className="flex flex-col gap-4">
        <TextField
          label={t('signin.usernameOrEmail')}
          placeholder={t('signin.usernamePlaceholder')}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
          errorText={errors.email}
          error={!!errors.email}
          disabled={loading}
        />

        <TextField
          label={t('signin.password')}
          placeholder={t('signin.passwordPlaceholder')}
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
          errorText={errors.password}
          error={!!errors.password}
          disabled={loading}
        />

        <Button
          title={loading ? t("common.loading") : t("signin.login")}
          variant="outline" 
          onPress={handleSubmit}
          loading={loading}
          className="mt-4"
        />

        <Separator className="my-4" />

        <GoogleSignIn />

        <View className="flex-row flex-wrap items-center justify-center mt-6 gap-1">
          <Text color="secondary" type="body">
            {t('signin.noAccount')}
          </Text>
  
          <View>
            <Button 
            title={t("signin.createAccount")} 
            variant="link" 
            onPress={onShowRegister} 
            className="h-auto min-h-0 p-0 bg-transparent active:opacity-60"
            textClassName="text-blue-600 font-semibold ml-1"
            />
          </View>
        </View>
      </View>
    </View>
  );
};