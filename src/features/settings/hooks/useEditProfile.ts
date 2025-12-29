import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert, Animated, Platform, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@app/providers/AuthProvider';
import { updateProfileUseCase } from '../../../app/di';
import { getInitials } from '@core/utils/profile';
import { SettingsStackParamList } from '../../../app/navigation/routes-types';
import { ImageUploadError } from '../../../domain/use-cases/profile/UpdateProfileUseCase';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper'; // Reutilizamos tu mapper

export const useEditProfile = () => {
  const { user, refreshSession } = useAuth(); 
  const { t } = useTranslation('settings');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<SettingsStackParamList, 'EditProfile'>>();
  
  const initialProfile = route.params.profile;
  
  useEffect(() => {
    if (!initialProfile || !user) {
      navigation.goBack();
    }
  }, [initialProfile, user, navigation]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState(initialProfile?.fullName || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const imageSource = selectedImage 
    ? { uri: selectedImage.uri } 
    : (initialProfile?.avatarUrl ? { uri: initialProfile.avatarUrl } : null); // null mostrará el placeholder

  const initials = initialProfile ? getInitials(fullName) : "?";

  const hasChanges = 
    fullName !== initialProfile?.fullName ||
    bio !== initialProfile?.bio ||
    selectedImage !== null;

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!hasChanges || loading) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        t('common.attention', 'Atención'),
        t('discardChanges', 'Tienes cambios sin guardar. ¿Deseas salir?'),
        [
          { text: t('common.cancel', 'Cancelar'), style: 'cancel', onPress: () => {} },
          {
            text: t('discard', 'Salir'),
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, hasChanges, loading, t]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        t('permissions.title', 'Permiso denegado'),
        t('permissions.msg', 'Necesitamos acceso a tu galería para cambiar la foto.'),
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
        ]
      );
      return;
    }

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
                Alert.alert(t('error'), t('imageTooLarge', 'La imagen es muy grande. Máximo 5MB.'));
                return;
            }
            setSelectedImage(asset);
        }
    } catch (e) {
        console.error("Picker Error", e);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !initialProfile) return;

    if (!fullName.trim()) {
        Alert.alert(t('error'), t('nameRequired', 'El nombre es obligatorio'));
        return;
    }

    setLoading(true);

    try {
      const nameParts = fullName.trim().split(/\s+/); 
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' '); 

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
      if (error instanceof ImageUploadError) {
          Alert.alert(
              t('common.attention'), 
              t('updatePartial', 'Tu perfil se actualizó, pero hubo un problema subiendo la foto. Intenta subirla de nuevo.'),
              [{ text: "OK", onPress: () => {
                  refreshSession().then(() => navigation.goBack());
              }}]
          );
      } else {
          const msg = getUserFriendlyErrorMessage(error, t);
          Alert.alert(t('common.error'), msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
      navigation.goBack();
  };

  return {
    t,
    loading,
    scrollY,
    profile: initialProfile,
    fullName, setFullName,
    bio, setBio,
    imageSource,
    initials,
    pickImage,
    handleSave,
    handleCancel,
    hasChanges 
  };
};