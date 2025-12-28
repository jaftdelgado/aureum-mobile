import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../app/providers/AuthProvider'; 
import { loginSchema, LoginFormData } from '../schemas/loginSchema'; 

export const useLoginForm = (onShowRegister?: () => void) => {
  const { t } = useTranslation('auth');
  const { login } = useAuth(); 
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

  const formData = watch();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      console.log("Login attempt result:", error.message); 
      
      let message = t('common.genericLoginError');

      if (error.message?.includes("Invalid login") || error.message?.includes("invalid_credentials")) {
        message = t('signin.errors.invalidCredentials');
      }

      setErrorMsg(message);
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