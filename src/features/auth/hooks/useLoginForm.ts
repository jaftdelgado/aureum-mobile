import { useState, useEffect } from 'react';
import { Alert } from 'react-native'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider'; 
import { loginSchema, LoginFormData } from '../schemas/loginSchema'; 
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

export const useLoginForm = (onShowRegister?: () => void) => {
  const { t } = useTranslation('auth');
  
  const { login, logoutReason, clearLogoutReason } = useAuth(); 
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (logoutReason === 'network_lost') {
      Alert.alert(
        t('common.attention'),
        t('signin.errors.networkLost'),
        [
          { 
            text: "OK", 
            onPress: () => clearLogoutReason()
          }
        ]
      );
    } else if (logoutReason === 'session_expired') {
      Alert.alert(
        t('common.attention'),
        t('signin.errors.sessionExpired'),
        [{ text: "OK", onPress: () => clearLogoutReason() }]
      );
    }
  }, [logoutReason, clearLogoutReason, t]);

  const formData = watch();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      console.error("Login Error:", error); 
    
      const userMessage = getUserFriendlyErrorMessage(error, t);
    
      setErrorMsg(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setValue(field, value, { shouldValidate: true });
  };

  return {
    control,
    formData,
    errors,
    loading,
    errorMsg,
    handleChange, 
    handleSubmit: handleSubmit(onSubmit),
    onShowRegister
  };
};