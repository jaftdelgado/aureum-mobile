import { useState, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthProvider';
import { profileRepository } from '../../../app/di';
import { UserProfile } from '../../../domain/entities/UserProfile';
import { getInitials } from '@core/utils/profile';

export const useEditProfile = () => {
  const { user, refreshSession } = useAuth(); 
  const { t } = useTranslation('settings');
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const data = await profileRepository.getProfile(user.id);
        if (data) {
          setProfile(data);
          setFullName(data.fullName || '');
          setBio(data.bio || '');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfileData();
  }, [user?.id]);

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
      if (fullName !== profile.fullName || bio !== profile.bio) {
        await profileRepository.updateProfile(user.id, {
           bio: bio,
           full_name: fullName,
        } as any); 
        
      }

      if (selectedImage) {
        try {
          console.log("Subiendo imagen:", selectedImage.uri);
          await profileRepository.uploadAvatar(user.id, {
            uri: selectedImage.uri,
            name: selectedImage.fileName || 'upload.jpg',
            type: selectedImage.mimeType || 'image/jpeg' 
          });
        } catch (imgError) {
          console.error("Error detallado de imagen:", imgError);
          throw imgError;
        }
      }

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