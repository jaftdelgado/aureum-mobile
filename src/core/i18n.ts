import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; 

const resources = {
  es: {
    translation: {
      signin: {
        title: "Iniciar Sesión",
        usernameOrEmail: "Correo electrónico",
        password: "Contraseña",
        login: "Entrar",
        noAccount: "¿No tienes cuenta?",
        createAccount: "Crear cuenta",
        continueWithGoogle: "Continuar con Google"
      },
      signup: {
        back: "Volver al inicio", 
        next: "Siguiente",
        createAccount: "Crear cuenta",
        personalInfo: "Información personal",
      },
      common: {
        loading: "Cargando..."
      },
      validation: {
        required: "Requerido",
        email: "Correo inválido",
        minLength: "Mínimo {{min}} caracteres",
        maxLength: "Máximo {{max}} caracteres",
        format: "Formato incorrecto"
      }
    }
  },
  en: {
    translation: {
      signin: {
        title: "Sign In",
        usernameOrEmail: "Email address",
        password: "Password",
        login: "Log In",
        noAccount: "Don't have an account?",
        createAccount: "Sign Up",
        continueWithGoogle: "Continue with Google"
      },
      common: {
        loading: "Loading..."
      },
      validation: {
        required: "Required",
        email: "Invalid email",
        minLength: "Minimum {{min}} characters",
        maxLength: "Maximum {{max}} characters",
        format: "Invalid format"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.getLocales()[0].languageCode ?? "es", 
    fallbackLng: "es",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;