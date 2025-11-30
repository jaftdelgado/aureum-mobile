import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../infra/external/supabase';

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const validateEmail = (email: string): string | null => {
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length > 254) return t("validation.maxLength", { max: 254 });
    if (trimmedEmail.length < 5) return t("validation.minLength", { min: 5 });

    const injectionPattern = /['";<>]|--/;
    if (injectionPattern.test(trimmedEmail)) {
      return t("validation.format");
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return t("validation.email");
    }

    const domainParts = trimmedEmail.split('@')[1].split('.');
    if (domainParts.some(part => part.length === 0)) {
      return t("validation.format");
    }

    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return t("validation.required");
    if (password.length > 128) return t("validation.maxLength", { max: 128 });
    
    if (/<script>|javascript:/i.test(password)) {
        return t("validation.format");
    }
    
    return null;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async () => {
    const { email, password } = formData;

    const newErrors: typeof errors = {};
    
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
           throw new Error(t("signin.invalidCredentials"));
        }
        throw error;
      }
    
    } catch (err: any) {
      setErrorMsg(err.message || t("signin.loginError"));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    loading,
    errors,
    errorMsg,
    handleSubmit
  };
};