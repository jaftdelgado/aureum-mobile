import { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker'; 
import { useAuth } from '@app/providers/AuthProvider';
import { createTeamUseCase } from '../../../app/di'; 
import { invalidateTeamsCache } from '../hooks/useTeamsList';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

export const useCreateTeam = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'professor') {
      Alert.alert(t('common.error'), t('create.unauthorized', 'Solo los profesores pueden crear cursos.'));
      navigation.goBack();
    }
  }, [user, navigation, t]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (loading) {
        e.preventDefault(); 
      }
    });
    return unsubscribe;
  }, [navigation, loading]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('permissions.title', 'Permiso denegado'),
        t('permissions.msg', 'Necesitamos acceso a la galería para la portada.'),
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], 
      quality: 0.6, 
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        Alert.alert(t('common.attention'), t('create.image_too_large', 'La imagen es muy pesada. Máximo 5MB.'));
        return;
      }
      
      setSelectedImage(asset);
    }
  };

  const validateForm = () => {
    if (!selectedImage) {
      Alert.alert(t('common.attention'), t('create.req_image'));
      return false;
    }
    if (!name.trim() || name.trim().length < 3) {
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
    if (loading) return;
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

      await invalidateTeamsCache(user.id);

      Alert.alert(
        t('create.success_title'),
        t('create.success_msg'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      let msg = getUserFriendlyErrorMessage(error, t);
      if (error.message === 'IMAGE_TOO_LARGE_SERVER') {
        msg = t('create.image_too_large');
      }

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
    goBack: () => !loading && navigation.goBack()
  };
};