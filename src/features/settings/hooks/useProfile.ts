import { useRef } from 'react';
import { Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@app/providers/AuthProvider';
import { getAvatarUrl, getInitials } from '@core/utils/profile';

export const useProfile = () => {
  const { t } = useTranslation('settings');
  const { user, profile } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const avatarUrl = getAvatarUrl(profile);
  const initials = profile ? getInitials(profile.full_name) : "?";

  const handleGoBack = () => navigation.goBack();

  console.log("Datos del Perfil:", profile); 
  console.log("ID de Foto:", profile?.profile_pic_id);
  console.log("URL Generada:", avatarUrl);

  return {
    t,
    user,
    profile,
    insets,
    scrollY,
    avatarUrl,
    initials,
    handleGoBack,
  };
};