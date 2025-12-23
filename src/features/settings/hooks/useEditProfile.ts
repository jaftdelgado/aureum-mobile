import { useState, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthProvider';
import { profileRepository, updateProfileUseCase } from '../../../app/di';
import { UserProfile } from '../../../domain/entities/UserProfile';
import { getInitials } from '@core/utils/profile';
import { AppStackParamList } from '../../../app/navigation/routes-types';

export const useEditProfile = () => {
  const { user, refreshSession } = useAuth(); 
  const { t } = useTranslation('settings');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'EditProfile'>>();
  const initialProfile = route.params.profile;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [fullName, setFullName] = useState(initialProfile.fullName || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const imageSource = selectedImage 
    ? { uri: selectedImage.uri } 
    : (profile?.avatarUrl ? { uri: profile.avatarUrl } : null);

  const initials = profile ? getInitials(fullName) : "?";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !profile) return;
    setLoading(true);

    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await updateProfileUseCase.execute({
            userId: user.id,
            firstName,
            lastName,
            bio,
            image: selectedImage ? {
                uri: selectedImage.uri,
                fileName: selectedImage.fileName || undefined,
                mimeType: selectedImage.mimeType || undefined
            } : undefined
        });

      await refreshSession();

      navigation.goBack();
      
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('updateError', 'Error al actualizar perfil'));
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