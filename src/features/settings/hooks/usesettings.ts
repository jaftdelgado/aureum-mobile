import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useAuth } from '@app/providers/AuthProvider';
import { deleteUserProfile } from '@features/auth/api/authApi';
import { useTranslation } from 'react-i18next';

export const useSettings = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    const performLogout = async () => {
      try {
        await signOut();
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t("settings.logoutMsg"))) performLogout();
    } else {
      Alert.alert(
        t("settings.logoutTitle"),
        t("settings.logoutMsg"),
        [
          { text: t("common.cancel"), style: "cancel" },
          { 
            text: t("settings.logoutConfirm"), 
            style: "destructive", 
            onPress: performLogout 
          },
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
        await signOut(); 
      } catch (error) {
        console.error("Error al eliminar cuenta:", error);
        Alert.alert(t("common.error"), "No se pudo eliminar la cuenta. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(t("settings.deleteMsg"))) performDelete();
    } else {
      Alert.alert(
        t("settings.deleteTitle"),
        t("settings.deleteMsg"),
        [
          { text: t("common.cancel"), style: "cancel" },
          { 
            text: t("settings.deleteConfirm"), 
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
    handleDeleteAccount
  };
};