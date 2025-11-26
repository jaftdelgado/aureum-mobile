import { useState } from 'react';
import { supabase } from '../../../infra/external/supabase';

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({ email: '', password: '' });

  const validateEmail = (email: string): string | null => {
    const trimmedEmail = email.trim();
    
    if (trimmedEmail.length > 254) return "El correo excede la longitud máxima permitida";
    if (trimmedEmail.length < 5) return "El correo es demasiado corto";

    const injectionPattern = /['";<>]|--/;
    if (injectionPattern.test(trimmedEmail)) {
      return "El correo contiene caracteres no permitidos";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return "Ingresa un formato de correo válido (ej: usuario@dominio.com)";
    }

    const domainParts = trimmedEmail.split('@')[1].split('.');
    if (domainParts.some(part => part.length === 0)) {
      return "El dominio del correo es inválido";
    }

    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "La contraseña es requerida";
    if (password.length > 128) return "La contraseña es demasiado larga";
    
    if (/<script>|javascript:/i.test(password)) {
        return "Contraseña inválida";
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
           throw new Error("Correo o contraseña incorrectos");
        }
        throw error;
      }
    
    } catch (err: any) {
      setErrorMsg(err.message || "Error al iniciar sesión");
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