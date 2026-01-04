import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@core/ui/Text'; 
import { useThemeColor } from '@core/design/useThemeColor'; 
import { useLessons } from '../hooks/useLessons';
import { lessonsRepository } from '@app/di';
import { useTranslation } from 'react-i18next';
import { supabase } from '@infra/external/supabase'; 

// Helper para formatear el tiempo del video (mm:ss)
const formatTime = (millis: number) => {
  if (!millis || millis < 0) return "00:00";
  const totalSeconds = millis / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default function LessonsScreen() {
  const { t } = useTranslation('lessons');
  const { lessons, isLoading } = useLessons();
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isBuffering, setIsBuffering] = useState(false);

  // Colores del tema
  const backgroundColor = useThemeColor('bg');
  const cardColor = useThemeColor('card');
  const borderColor = useThemeColor('border');
  const primaryColor = useThemeColor('primary');
  const secondaryTextColor = useThemeColor('secondaryText');
  const whiteColor = useThemeColor('white');

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      console.log(token ? "✅ Token obtenido correctamente" : "❌ ERROR: Sin sesión");
      setAccessToken(token);
    };
    fetchSession();
  }, []);

  // Función que renderiza todo lo que va ARRIBA de la lista (Reproductor + Info)
  const renderHeader = () => {
    if (!selectedLesson) {
      return (
        <Text type="title3" weight="bold" className="mb-4 mt-2">
          {t('available_lessons')}
        </Text>
      );
    }

    return (
      <View className="w-full mb-6">
        {/* Contenedor del Video */}
        <View className="w-full aspect-video bg-black rounded-t-xl overflow-hidden relative">
          {accessToken ? (
            <Video
              key={selectedLesson.id}
              ref={videoRef}
              source={{ 
                uri: lessonsRepository.getVideoUrl(selectedLesson.id, accessToken),
               
              }}
              style={{ width: '100%', height: '100%' }} // Obligatorio para visibilidad en Android
              usePoster={true}
              posterSource={{ uri: selectedLesson.thumbnailUrl }}
              posterStyle={{ resizeMode: 'cover' }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={(s) => setStatus(() => s)}
              onLoadStart={() => setIsBuffering(true)}
              onReadyForDisplay={() => setIsBuffering(false)}
              onError={(err) => {
                console.error("❌ Error en el reproductor:", err);
                setIsBuffering(false);
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={whiteColor} />
            </View>
          )}
          
          {(isBuffering || status.isBuffering) && (
            <View className="absolute inset-0 items-center justify-center bg-black/40 z-10">
              <ActivityIndicator size="large" color={whiteColor} />
            </View>
          )}
        </View>

        {/* Panel de Controles Personalizados */}
        <View style={{ backgroundColor: cardColor, borderColor }} className="p-3 border-x border-b rounded-b-xl">
          {/* Fila del Slider (Progreso) */}
          <View className="flex-row items-center gap-2 mb-2">
            <Text color="secondary" type="caption2" className="w-10">
              {formatTime(status.positionMillis)}
            </Text>
            <Slider
              style={{ flex: 1, height: 40 }}
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
              {formatTime(status.durationMillis)}
            </Text>
          </View>

          {/* Fila de Botones de Acción */}
          <View className="flex-row justify-between items-center px-4">
            {/* Botón Fullscreen */}
            <TouchableOpacity onPress={() => videoRef.current?.presentFullscreenPlayer()}>
              <MaterialIcons name="fullscreen" size={28} color={secondaryTextColor} />
            </TouchableOpacity>

            {/* Controles Centrales */}
            <View className="flex-row items-center gap-6">
              <TouchableOpacity onPress={() => videoRef.current?.setPositionAsync((status.positionMillis || 0) - 10000)}>
                <MaterialIcons name="replay-10" size={30} color={secondaryTextColor} />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => status.isPlaying ? videoRef.current?.pauseAsync() : videoRef.current?.playAsync()}
                style={{ backgroundColor: primaryColor }}
                className="p-3 rounded-full"
              >
                <MaterialIcons name={status.isPlaying ? "pause" : "play-arrow"} size={32} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => videoRef.current?.setPositionAsync((status.positionMillis || 0) + 10000)}>
                <MaterialIcons name="forward-10" size={30} color={secondaryTextColor} />
              </TouchableOpacity>
            </View>

            {/* Botón Mute */}
            <TouchableOpacity onPress={() => videoRef.current?.setIsMutedAsync(!status.isMuted)}>
              <MaterialIcons name={status.isMuted ? "volume-off" : "volume-up"} size={28} color={secondaryTextColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de la lección seleccionada */}
        <View className="mt-4 px-2">
          <Text type="title3" weight="bold">{selectedLesson.title}</Text>
          <Text color="secondary" type="body" className="mt-1">{selectedLesson.description}</Text>
        </View>

        {/* Separador visual para la lista */}
        <Text type="title3" weight="bold" className="mb-4 mt-8">
          {t('available_lessons')}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <FlatList
        data={lessons}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader} // Mueve el video al encabezado de la lista
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setSelectedLesson(item)}
            style={{ 
              backgroundColor: cardColor, 
              borderColor: selectedLesson?.id === item.id ? primaryColor : borderColor 
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
        )}
      />
    </View>
  );
}