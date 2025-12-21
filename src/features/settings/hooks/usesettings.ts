import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '@app/providers/AuthProvider';
import { deleteUserProfile } from '@features/auth/api/authApi';
import { useTranslation } from 'react-i18next';
import { getAvatarUrl, getInitials } from '@core/utils/profile';


export const useSettings = () => {
  const { t, i18n } = useTranslation('settings');
  const { user, logout} = useAuth();
  const [loading, setLoading] = useState(false);

  const avatarUrl = user?.avatarUrl;
  const initials = user?.fullName ? getInitials(user.fullName) : "?";

  const handleChangeLanguage = () => {
    const changeTo = (lang: string) => {
      i18n.changeLanguage(lang);
    };

    if (Platform.OS === 'web') {
      const lang = window.prompt("Type 'es' for Spanish or 'en' for English", i18n.language);
      if (lang === 'es' || lang === 'en') changeTo(lang);
    } else {
      Alert.alert(
        t('changeLanguage'),
        t('selectLanguage'),
        [
          { 
            text: t('spanish'), 
            onPress: () => changeTo('es'),
            style: i18n.language === 'es' ? 'default' : 'default' 
          },
          { 
            text: t('english'), 
            onPress: () => changeTo('en') 
          }
        ]
      );
    }
  };

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t("logoutMsg"))) performLogout();
    } else {
      Alert.alert(
        t("logoutTitle"),
        t("logoutMsg"),
        [
          { 
            text: t("logoutConfirm"), 
            style: "destructive", 
            onPress: performLogout 
          },
          { text: t("cancel"), style: "cancel" },
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    const performDelete = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        await deleteUserProfile(user.id);
        await logout(); 
      } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        Alert.alert(t("common.error"), "No se pudo eliminar la cuenta. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t("deleteMsg"))) performDelete();
    } else {
      Alert.alert(
        t("deleteTitle"),
        t("deleteMsg"),
        [
          { text: t("cancel"), style: "cancel" },
          { 
            text: t("deleteConfirm"), 
            style: "destructive", 
            onPress: performDelete 
          },
        ]
      );
    }
  };

  return {
    loading,
    handleLogout,
    handleDeleteAccount,
    handleChangeLanguage,
    user,
    avatarUrl,
    initials
  };
};