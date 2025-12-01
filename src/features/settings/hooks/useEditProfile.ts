import { useState, useRef } from 'react';
import { Alert, Animated } from 'react-native'; // <--- Importar Animated
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@app/providers/AuthProvider';
import { updateProfile, uploadAvatar } from '@features/auth/api/authApi';
import { getAvatarUrl, getInitials } from '@core/utils/profile';

export const useEditProfile = () => {
  const { profile, refetchProfile } = useAuth();
  const { t } = useTranslation('settings');
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const currentAvatarUrl = getAvatarUrl(profile);
  const initials = profile ? getInitials(fullName) : "?";
  const imageSource = selectedImage 
    ? { uri: selectedImage } 
    : (currentAvatarUrl ? { uri: currentAvatarUrl } : null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    } as any);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      if (fullName !== profile.full_name || bio !== profile.bio) {
        await updateProfile(profile.auth_user_id, {
          full_name: fullName,
          bio: bio,
        });
      }

      if (selectedImage) {
        await uploadAvatar(profile.auth_user_id, selectedImage);
      }

      await refetchProfile();
      navigation.goBack();
      
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigation.goBack();

  return {
    t,
    loading,
    scrollY,
    profile,
    fullName, setFullName,
    bio, setBio,
    imageSource,
    initials,
    pickImage,
    handleSave,
    handleCancel
  };
};