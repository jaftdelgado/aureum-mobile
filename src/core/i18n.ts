import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  es: {
    translation: {
      common: {
        loading: "Cargando...",
        cancel: "Cancelar",
        confirm: "Confirmar",
        back: "Volver",
        next: "Siguiente",
        finish: "Finalizar",
        error: "Error",
        success: "Éxito"
      },
      validation: {
        required: "Requerido",
        email: "Correo inválido",
        minLength: "Mínimo {{min}} caracteres",
        maxLength: "Máximo {{max}} caracteres",
        format: "Formato incorrecto",
        passwordMatch: "Las contraseñas no coinciden"
      },
      signin: {
        title: "Iniciar Sesión",
        usernameOrEmail: "Correo electrónico",
        usernamePlaceholder: "ejemplo@correo.com", 
        password: "Contraseña",
        passwordPlaceholder: "••••••••", 
        login: "Entrar",
        noAccount: "¿No tienes cuenta?",
        createAccount: "Regístrate",
        continueWithGoogle: "Continuar con Google",
        loginError: "Error al iniciar sesión", 
        invalidCredentials: "Correo o contraseña incorrectos"
      },
      signup: {
        createAccount: "Crear Cuenta",
        completeRegistration: "Completa tu Registro",
        personalInfo: "Información personal",
        firstName: "Nombre",
        firstNamePlaceholder: "Ej. Juan",
        lastName: "Apellido",
        lastNamePlaceholder: "Ej. Pérez",
        email: "Email",
        emailPlaceholder: "correo@ejemplo.com",
        usernameLabel: "Usuario (@)",
        usernamePlaceholder: "usuario123",
        accountType: "Tipo de cuenta",
        student: "Estudiante",
        teacher: "Profesor",
        credentials: "Credenciales",
        password: "Contraseña",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirmar",
        confirmPasswordPlaceholder: "••••••••",
        allSet: "¡Todo listo!",
        accountCreated: "Tu cuenta ha sido configurada correctamente.",
        goToDashboard: "Ir al Dashboard",
        goToLogin: "Volver al Login",
        back: "Atrás"
      },
      settings: {
        title: "Configuración",
        subtitle: "Gestiona tus preferencias y cuenta.",
        logout: "Cerrar Sesión",
        deleteAccount: "Eliminar Cuenta",
        deleting: "Eliminando...",
        logoutTitle: "Cerrar Sesión",
        logoutMsg: "¿Estás seguro de que quieres salir de tu cuenta?",
        logoutConfirm: "Salir",
        deleteTitle: "Eliminar Cuenta",
        deleteMsg: "Esto eliminará tu cuenta permanentemente. ¿Seguro que deseas borrarla?",
        deleteConfirm: "Eliminar"
      },
      tabs: {
        home: "Inicio",
        teams: "Cursos",
        lessons: "Lecciones",
        settings: "Ajustes"
      },
      navigation: {
        checkingProfile: "Verificando perfil..."
      }
    }
  },
  en: {
    translation: {
      common: {
        loading: "Loading...",
        cancel: "Cancel",
        confirm: "Confirm",
        back: "Back",
        next: "Next",
        finish: "Finish",
        error: "Error",
        success: "Success"
      },
      validation: {
        required: "Required",
        email: "Invalid email",
        minLength: "Minimum {{min}} characters",
        maxLength: "Maximum {{max}} characters",
        format: "Invalid format",
        passwordMatch: "Passwords do not match"
      },
      signin: {
        title: "Sign In",
        usernameOrEmail: "Email address",
        password: "Password",
        login: "Log In",
        noAccount: "Don't have an account?",
        createAccount: "Sign Up",
        continueWithGoogle: "Continue with Google",
        usernamePlaceholder: "email@example.com",
        passwordPlaceholder: "••••••••",
        loginError: "Login failed",
        invalidCredentials: "Invalid email or password"
      },
      signup: {
        createAccount: "Create Account",
        completeRegistration: "Complete Registration",
        personalInfo: "Personal Info",
        firstName: "First Name",
        firstNamePlaceholder: "Ex. John",
        lastName: "Last Name",
        lastNamePlaceholder: "Ex. Doe",
        email: "Email",
        emailPlaceholder: "email@example.com",
        usernameLabel: "Username (@)",
        usernamePlaceholder: "user123",
        accountType: "Account Type",
        student: "Student",
        teacher: "Professor",
        credentials: "Credentials",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm",
        confirmPasswordPlaceholder: "••••••••",
        allSet: "All Set!",
        accountCreated: "Your account has been successfully set up.",
        goToDashboard: "Go to Dashboard",
        goToLogin: "Back to Login",
        back: "Back"
      },
      settings: {
        title: "Settings",
        subtitle: "Manage your preferences and account.",
        logout: "Log Out",
        deleteAccount: "Delete Account",
        deleting: "Deleting...",
        logoutTitle: "Log Out",
        logoutMsg: "Are you sure you want to log out?",
        logoutConfirm: "Log Out",
        deleteTitle: "Delete Account",
        deleteMsg: "This will permanently delete your account. Are you sure?",
        deleteConfirm: "Delete"
      },
      tabs: {
        home: "Home",
        teams: "Teams",
        lessons: "Lessons",
        settings: "Settings"
      },
      navigation: {
        checkingProfile: "Checking profile..."
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
    interpolation: { escapeValue: false }
  });

export default i18n;