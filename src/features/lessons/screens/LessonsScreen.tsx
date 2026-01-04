import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video'; 
import { Text } from '@core/ui/Text'; 
import { useThemeColor } from '@core/design/useThemeColor'; 
import { useLessons } from '../hooks/useLessons';
import { lessonsRepository } from '@app/di';
import { useTranslation } from 'react-i18next';
import { supabase } from '@infra/external/supabase'; 

// --- Componente de Ítem de la Lista (Optimizado) ---
const LessonItem = memo(({ item, isSelected, onPress, cardColor, primaryColor, borderColor }: any) => (
  <TouchableOpacity 
    onPress={() => onPress(item)}
    style={{ 
      backgroundColor: cardColor, 
      borderColor: isSelected ? primaryColor : borderColor 
    }}
    className="flex-row p-3 mb-3 rounded-lg border"
  >
    {item.thumbnailUrl && (
      <Image 
        source={{ uri: item.thumbnailUrl }} 
        className="w-16 h-16 rounded bg-zinc-800" 
        resizeMode="cover" 
      />
    )}
    <View className="flex-1 ml-3 justify-center">
      <Text weight="bold" numberOfLines={1}>{item.title}</Text>
      <Text color="secondary" type="caption1" className="mt-1" numberOfLines={2}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
));

const VideoPlayerSection = ({ selectedLesson, accessToken, colors }: any) => {
  // 1. Log para ver qué ID y Token tenemos
  console.log("🎬 Cargando lección:", selectedLesson.id);
  
  const videoSource = lessonsRepository.getVideoUrl(selectedLesson.id, accessToken);
  
  // 2. LOG CRÍTICO: Copia esta URL de tu terminal y pégala en un navegador (Chrome/Safari)
  console.log("🔗 URL Generada:", videoSource);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  return (
    <View className="w-full mb-6">
      <View className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <VideoView
          player={player}
          style={{ width: '100%', height: '100%' }}
          allowsFullscreen
          allowsPictureInPicture
          startsPictureInPictureAutomatically
        />
      </View>
      <View className="mt-4 px-2">
        <Text type="title3" weight="bold">{selectedLesson.title}</Text>
        <Text color="secondary" type="body" className="mt-1">{selectedLesson.description}</Text>
      </View>
    </View>
  );
};

// --- Pantalla Principal ---
export default function LessonsScreen() {
  const { t } = useTranslation('lessons');
  const { lessons, isLoading } = useLessons();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const colors = {
    bg: useThemeColor('bg'),
    card: useThemeColor('card'),
    border: useThemeColor('border'),
    primary: useThemeColor('primary'),
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAccessToken(data.session?.access_token || null);
    });
  }, []);

  const handleSelectLesson = useCallback((item: any) => {
    setSelectedLesson(item);
  }, []);

  const renderHeader = () => (
    <View>
      {selectedLesson && accessToken ? (
        <VideoPlayerSection 
          selectedLesson={selectedLesson} 
          accessToken={accessToken} 
          colors={colors} 
        />
      ) : (
        <Text type="title3" weight="bold" className="mb-4 mt-2">
          {t('available_lessons')}
        </Text>
      )}
      {selectedLesson && (
        <Text type="title3" weight="bold" className="mb-4 mt-8">
          {t('available_lessons')}
        </Text>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={lessons}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LessonItem 
            item={item} 
            isSelected={selectedLesson?.id === item.id} 
            onPress={handleSelectLesson}
            cardColor={colors.card} 
            primaryColor={colors.primary} 
            borderColor={colors.border}
          />
        )}
      />
    </View>
  );
}