import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@app/providers/AuthProvider';
import { ProfileApiRepository } from '../../../infra/api/users/ProfileApiRepository'; 
import { UserProfile } from '../../../domain/entities/UserProfile'; 
import { getInitials } from '@core/utils/profile';
import { Animated } from 'react-native';
import { useAppNavigation } from '@app/hooks/useAppNavigation';

export const useProfile = () => {
  const { t } = useTranslation('settings');
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useAppNavigation();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

      return () => { isActive = false; };
    }, [user?.id])
  );

  const avatarUrl = profile?.avatarUrl || null; 
  const initials = profile ? getInitials(profile.fullName) : "?";
  const scrollY = useRef(new Animated.Value(0)).current;
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
    handleEditProfile,
  };
};