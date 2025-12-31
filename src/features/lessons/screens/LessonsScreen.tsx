import React, { useState, useRef } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Text } from '@core/ui/Text';
import { useThemeColor } from '@core/design/useThemeColor'; 
import { useLessons } from '../hooks/useLessons';
import { lessonsRepository } from '@app/di';
import { Lesson } from '@domain/entities/Lesson';

const formatTime = (millis: number) => {
  const totalSeconds = millis / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function LessonsScreen() {
  const { lessons, isLoading } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isBuffering, setIsBuffering] = useState(false);

  const iconGray = useThemeColor('secondaryText'); 
  const iconWhite = useThemeColor('white');
  const primaryColor = useThemeColor('primary');

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
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950 p-4">
      {selectedLesson && (
        <View className="w-full mb-6">
          <View className="w-full aspect-video bg-black rounded-xl overflow-hidden relative">
            <Video
              ref={videoRef}
              source={{ uri: lessonsRepository.getVideoUrl(selectedLesson.id) }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={(s) => setStatus(() => s)}
              onLoadStart={() => setIsBuffering(true)}
              onReadyForDisplay={() => setIsBuffering(false)}
              className="w-full h-full"
            />

            {/* Pantalla de carga */}
            {(isBuffering || (status.isLoaded && status.isBuffering)) && (
              <View className="absolute inset-0 items-center justify-center bg-black/40 z-10">
                <ActivityIndicator size="large" color={iconWhite} />
                <Text className="text-white text-xs mt-2 font-medium">Cargando video...</Text>
              </View>
            )}
          </View>

          {/* Controles del reproductor */}
          <View className="bg-zinc-900 p-3 rounded-b-xl border-x border-b border-zinc-800">
            {/* Barra de progreso interactiva */}
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-[10px] text-zinc-400 w-8">{formatTime(status.positionMillis || 0)}</Text>
              <Slider
                className="flex-1 h-10"
                minimumValue={0}
                maximumValue={status.durationMillis || 100}
                value={status.positionMillis || 0}
                onSlidingComplete={async (value) => {
                  if (videoRef.current) await videoRef.current.setPositionAsync(value);
                }}
                minimumTrackTintColor={primaryColor}
                maximumTrackTintColor="#3f3f46"
                thumbTintColor={primaryColor}
              />
              <Text className="text-[10px] text-zinc-400 w-8">{formatTime(status.durationMillis || 0)}</Text>
            </View>

            {/* Botones de acción principales */}
            <View className="flex-row justify-between items-center px-4">
              {/* Botón Fullscreen */}
              <TouchableOpacity onPress={handleFullscreen}>
                <MaterialIcons name="fullscreen" size={28} color={iconGray} />
              </TouchableOpacity>

              {/* Controles centrales */}
              <View className="flex-row items-center gap-6">
                <TouchableOpacity onPress={() => handleSkip(-10)}>
                  <MaterialIcons name="replay-10" size={30} color={iconWhite} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}
                  className="bg-indigo-500 p-3 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MaterialIcons 
                    name={status.isPlaying ? "pause" : "play-arrow"} 
                    size={32} 
                    color="white" 
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleSkip(10)}>
                  <MaterialIcons name="forward-10" size={30} color={iconWhite} />
                </TouchableOpacity>
              </View>

              {/* Botón mute */}
              <TouchableOpacity onPress={async () => {
                  if (videoRef.current) await videoRef.current.setIsMutedAsync(!status.isMuted);
              }}>
                <MaterialIcons 
                  name={status.isMuted ? "volume-off" : "volume-up"} 
                  size={28} 
                  color={iconGray} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Lista de lecciones */}
      <Text className="text-xl font-bold text-white mb-4">Mis Lecciones</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setSelectedLesson(item)}
            className={`flex-row p-3 mb-3 rounded-lg border ${selectedLesson?.id === item.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}
          >
            {item.thumbnailUrl && (
              <Image source={{ uri: item.thumbnailUrl }} className="w-16 h-16 rounded bg-zinc-800" />
            )}
            <View className="flex-1 ml-3 justify-center">
              <Text className="text-white font-bold" numberOfLines={1}>{item.title}</Text>
              <Text className="text-zinc-500 text-xs mt-1" numberOfLines={2}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}