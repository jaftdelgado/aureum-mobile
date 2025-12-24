import React from 'react';
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { TextField } from '@core/ui/TextField';
import { useCreateTeam } from '../hooks/useCreateTeam'; 

export const CreateTeamScreen = () => {
  const { 
    t, 
    name, setName, 
    description, setDescription, 
    selectedImage, pickImage, 
    loading, handleCreate, goBack 
  } = useCreateTeam();
  
  const insets = useSafeAreaInsets();
  const MAX_DESC_LENGTH = 160;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white px-6" style={{ paddingTop: insets.top + 60 }}>
        
        <View className="flex-row justify-center items-center mb-6">
          <Text type="title2" weight="bold">{t('create.title')}</Text>
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
                <Text type="caption1" color="secondary">{t('create.upload_cover')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextField
            label={t('create.team_name')}
            placeholder={t('create.name_placeholder')}
            value={name}
            onChangeText={setName}
            className="mb-4"
          />

          <View className="mb-2">
            <TextField
              label={t('create.description')}
              placeholder={t('create.desc_placeholder')}
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
            title={loading ? t('create.creating') : t('create.action')}
            onPress={handleCreate}
            loading={loading}
            disabled={loading} 
            className="mt-6"
          />
          
          <Button 
            title={t('common.cancel')} 
            variant="outline" 
            onPress={goBack} 
            className="mt-2"
            textClassName="text-secondary"
          />
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};