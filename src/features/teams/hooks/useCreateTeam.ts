import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker'; 
import { useAuth } from '@app/providers/AuthProvider';
import { createTeamUseCase } from '../../../app/di'; 
import { invalidateTeamsCache } from '../hooks/useTeamsList';

export const useCreateTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], 
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const validateForm = () => {
    if (!selectedImage) {
      Alert.alert(t('common.attention'), t('create.req_image'));
      return false;
    }
    if (!name.trim()) {
      Alert.alert(t('common.attention'), t('create.req_name'));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('common.attention'), t('create.req_desc'));
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    if (!user?.id) return;

    setLoading(true);
    try {
      await createTeamUseCase.execute({
        name: name.trim(),
        description: description.trim(),
        professor_id: user.id,
        image: selectedImage ? {
            uri: selectedImage.uri,
            name: selectedImage.fileName || 'cover.jpg',
            type: selectedImage.mimeType || 'image/jpeg'
        } : undefined
      });

      if (user?.id) {
        await invalidateTeamsCache(user.id); 
      }

      Alert.alert(
        t('create.success_title'),
        t('create.success_msg'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      const msg = error.message || t('create.error_msg');
      Alert.alert(t('common.error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    name, setName,
    description, setDescription,
    selectedImage, pickImage, 
    loading,
    handleCreate,
    goBack: () => navigation.goBack()
  };
};