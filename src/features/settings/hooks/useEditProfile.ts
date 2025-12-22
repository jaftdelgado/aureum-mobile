import { useState, useRef, useEffect } from 'react';
import { Alert, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@app/providers/AuthProvider';
import { ProfileApiRepository } from '../../../infra/api/users/ProfileApiRepository'; // Usamos el Repo
import { UserProfile } from '../../../domain/entities/UserProfile';
import { getAvatarUrl, getInitials } from '@core/utils/profile';

export const useEditProfile = () => {
  const { user } = useAuth(); 
  const { t } = useTranslation('settings');
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;
  const profileRepo = new ProfileApiRepository();
  
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
        if (!user?.id) return;
        try {
            const data = await profileRepo.getProfile(user.id);
            if (data) {
                setProfile(data);
                setFullName(data.fullName || '');
                setBio(data.bio || '');
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t('error'), "No se pudo cargar el perfil");
            navigation.goBack();
        }
    };
    fetchProfileData();
  }, [user?.id]);

  const currentAvatarUrl = getAvatarUrl(profile);
  const initials = profile ? getInitials(fullName) : "?";
  
  const imageSource = selectedImage 
    ? { uri: selectedImage.uri } 
    : (currentAvatarUrl ? { uri: currentAvatarUrl } : null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Corrección de tipo
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
        await profileRepo.updateProfile(user.id, {
           bio: bio,
        } as any); 
        
      }

      if (selectedImage) {
        await profileRepo.uploadAvatar(user.id, {
            uri: selectedImage.uri,
            type: selectedImage.mimeType, 
            fileName: selectedImage.fileName
        });
      }

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