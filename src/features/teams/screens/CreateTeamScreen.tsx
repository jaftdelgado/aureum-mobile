import React, { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@app/providers/AuthProvider';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import { TeamsApiRepository } from '../../../infra/api/teams/TeamsApiRepository';

export const CreateTeamScreen = () => {
  const { t } = useTranslation('teams');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const teamsRepo = new TeamsApiRepository();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_DESC_LENGTH = 160;

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
      Alert.alert(t('attention', 'Atención'), t('req_image', 'La imagen de portada es obligatoria.'));
      return false;
    }
    if (!name.trim()) {
      Alert.alert(t('attention', 'Atención'), t('req_name', 'El nombre del curso es obligatorio.'));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('attention', 'Atención'), t('req_desc', 'La descripción es obligatoria.'));
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    if (!user?.id) return;
    setLoading(true);
    try {
      await teamsRepo.createTeam({
        name: name.trim(),
        description: description.trim(),
        professor_id: user.id,
        image: {
          uri: selectedImage!.uri,
          type: selectedImage!.mimeType || 'image/jpeg',
          name: selectedImage!.fileName || 'cover.jpg'
        }
      });
      
      Alert.alert(
        t('success', '¡Curso Creado!'),
        t('create_success', 'Tu nuevo curso está listo. Recuerda configurarlo en la ventana de settings'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      console.error(error);
      const msg = error.message || t('create_error', 'No se pudo crear el curso.');
      Alert.alert(t('error', 'Error'), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6" style={{ paddingTop: insets.top + 60 }}>
        
        <View className="flex-row justify-center items-center mb-6">
          <Text type="title2" weight="bold">Crear Nuevo Curso</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className={`w-full h-44 rounded-xl mb-6 justify-center items-center overflow-hidden border-2 border-dashed ${
              selectedImage ? 'border-primary bg-white' : 'border-gray-300 bg-gray-50'
            }`}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage.uri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="items-center">
                <Text type="caption1" color="secondary">Subir portada</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextField
            label={t('team_name', 'Nombre del Curso')}
            placeholder="Ej. Matemáticas Avanzadas"
            value={name}
            onChangeText={setName}
            className="mb-4"
          />

          <View className="mb-2">
            <TextField
              label={t('description', 'Descripción')}
              placeholder="Breve descripción de los objetivos..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={MAX_DESC_LENGTH} 
              className="h-24 py-3" 
              textAlignVertical="top"
            />
            <Text 
              type="caption2" 
              className={`text-right ${description.length === MAX_DESC_LENGTH ? 'text-red-500 font-bold' : 'text-gray-400'}`}
            >
              {description.length}/{MAX_DESC_LENGTH}
            </Text>
          </View>

          <Button
            title={loading ? t('creating', 'Creando...') : t('create_action', 'Crear Curso')}
            onPress={handleCreate}
            loading={loading}
            disabled={loading} 
            className="mt-6"
          />
          
          <Button 
            title={t('cancel', 'Cancelar')} 
            variant="outline" 
            onPress={() => navigation.goBack()} 
            className="mt-2"
            textClassName="text-secondary"
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};