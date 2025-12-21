import { useState, useCallback } from 'react';
import { Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '@app/providers/AuthProvider';
import { AppStackParamList } from '@app/navigation/AppStack';
import { ProfileApiRepository } from '../../../infra/api/users/ProfileApiRepository'; // <--- Importar Repositorio
import { UserProfile } from '../../../domain/entities/UserProfile'; // <--- Importar Entidad
import { getAvatarUrl, getInitials } from '@core/utils/profile';

export const useProfile = () => {
  const { t } = useTranslation('settings');
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfile = async () => {
        if (!user?.id) return;
        
        try {
          const profileRepo = new ProfileApiRepository();
          const data = await profileRepo.getProfile(user.id);
          
          if (isActive && data) {
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchProfile();

      return () => {
        isActive = false;
      };
    }, [user?.id])
  );

  const avatarUrl = getAvatarUrl(profile);
  const initials = profile ? getInitials(profile.fullName) : "?";

  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleGoBack = () => navigation.goBack();

  return {
    t,
    user,
    profile, 
    loading, 
    insets,
    scrollY,
    avatarUrl,
    initials,
    handleGoBack,
    handleEditProfile
  };
};