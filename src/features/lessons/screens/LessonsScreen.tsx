import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@core/ui/Text'; 
import { useThemeColor } from '@core/design/useThemeColor'; 
import { useLessons } from '../hooks/useLessons';
import { lessonsRepository } from '@app/di';
import { Lesson } from '@domain/entities/Lesson';
import { useTranslation } from 'react-i18next';
import { supabase } from '@infra/external/supabase'; 

const formatTime = (millis: number) => {
  const totalSeconds = millis / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function LessonsScreen() {
  const { t } = useTranslation('lessons');
  const { lessons, isLoading } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isBuffering, setIsBuffering] = useState(false);

  const backgroundColor = useThemeColor('bg');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');
  const primaryColor = useThemeColor('primary');
  const secondaryTextColor = useThemeColor('secondaryText');
  const whiteColor = useThemeColor('white');

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthToken(data.session?.access_token || null);
    };
    getSession();
  }, []);

  const handleSkip = async (seconds: number) => {
    if (videoRef.current && status.isLoaded) {
      const newPosition = status.positionMillis + (seconds * 1000);
      await videoRef.current.setPositionAsync(
        Math.max(0, Math.min(newPosition, status.durationMillis || 0))
      );
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      await videoRef.current.presentFullscreenPlayer();
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }} className="p-4">
      {selectedLesson && (
        <View className="w-full mb-6">
          <View className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
            <Video
              ref={videoRef}
              source={{ 
                uri: lessonsRepository.getVideoUrl(selectedLesson.id),
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
              }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={(s) => setStatus(() => s)}
              onLoadStart={() => setIsBuffering(true)}
              onReadyForDisplay={() => setIsBuffering(false)}
              className="w-full h-full"
            />
            
            {(isBuffering || (status.isLoaded && status.isBuffering)) && (
              <View className="absolute inset-0 items-center justify-center bg-black/40 z-10">
                <ActivityIndicator size="large" color={whiteColor} />
                <Text type="caption1" weight="medium" className="mt-2" style={{ color: whiteColor }}>
                  {t('loading_video')}
                </Text>
              </View>
            )}
          </View>

          {/* Controles del Reproductor */}
          <View 
            style={{ backgroundColor: cardColor, borderColor }} 
            className="p-3 rounded-b-xl border-x border-b"
          >
            {/* Barra de progreso */}
            <View className="flex-row items-center gap-2 mb-2">
              <Text color="secondary" type="caption2" className="w-10">
                {formatTime(status.positionMillis || 0)}
              </Text>
              <Slider
                className="flex-1 h-10"
                minimumValue={0}
                maximumValue={status.durationMillis || 100}
                value={status.positionMillis || 0}
                onSlidingComplete={async (value) => {
                  if (videoRef.current) await videoRef.current.setPositionAsync(value);
                }}
                minimumTrackTintColor={primaryColor}
                maximumTrackTintColor={borderColor}
                thumbTintColor={primaryColor}
              />
              <Text color="secondary" type="caption2" className="w-10">
                {formatTime(status.durationMillis || 0)}
              </Text>
            </View>

            {/* Botones de acción */}
            <View className="flex-row justify-between items-center px-4">
              <TouchableOpacity onPress={handleFullscreen}>
                <MaterialIcons name="fullscreen" size={28} color={secondaryTextColor} />
              </TouchableOpacity>

              <View className="flex-row items-center gap-6">
                <TouchableOpacity onPress={() => handleSkip(-10)}>
                  <MaterialIcons name="replay-10" size={30} color={secondaryTextColor} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}
                  style={{ backgroundColor: primaryColor }}
                  className="p-3 rounded-full"
                >
                  <MaterialIcons 
                    name={status.isPlaying ? "pause" : "play-arrow"} 
                    size={32} 
                    color="white" 
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSkip(10)}>
                  <MaterialIcons name="forward-10" size={30} color={secondaryTextColor} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={async () => {
                  if (videoRef.current) await videoRef.current.setIsMutedAsync(!status.isMuted);
              }}>
                <MaterialIcons 
                  name={status.isMuted ? "volume-off" : "volume-up"} 
                  size={28} 
                  color={secondaryTextColor} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Listado de lecciones */}
      <Text type="title3" weight="bold" className="mb-4">{t('available_lessons')}</Text>
      
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedLesson?.id === item.id;
          return (
            <TouchableOpacity 
              onPress={() => setSelectedLesson(item)}
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
          );
        }}
      />
    </View>
  );
}