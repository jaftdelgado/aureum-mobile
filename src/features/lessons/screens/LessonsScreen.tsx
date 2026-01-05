import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useLessons } from '../hooks/useLessons';
import { Text } from '@core/ui/Text';
import { GlassContainer } from '@core/ui/GlassContainer';
// IMPORTANTE: Importamos supabase para obtener el token crudo
import { supabase } from '@infra/external/supabase'; 
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import type { Lesson } from '@domain/entities/Lesson';

export default function LessonsScreen() {
  const { lessons, isLoading } = useLessons();
  const { t } = useTranslation('lessons');
  
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  // Nuevo estado para guardar el token
  const [token, setToken] = useState<string | null>(null);
  
  const videoRef = useRef<Video>(null);

  // 1. Obtener el token de sesión de Supabase al montar la pantalla
  useEffect(() => {
    const fetchSessionToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setToken(data.session.access_token);
      }
    };
    fetchSessionToken();
  }, []);

  // 2. Seleccionar lección por defecto
  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons]);

  const handleSelectLesson = (lesson: Lesson) => {
    setVideoError(false);
    setVideoLoading(true);
    setSelectedLesson(lesson);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`Error de video: ${status.error}`);
        setVideoError(true);
        setVideoLoading(false);
      }
      return;
    }
    setVideoLoading(status.isBuffering);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background pt-14 px-4">
      {/* --- REPRODUCTOR DE VIDEO --- */}
      <View className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 relative justify-center">
        {/* Verificamos que tengamos lección Y token antes de renderizar el video */}
        {selectedLesson && token ? (
          <>
            <Video
              ref={videoRef}
              style={{ width: '100%', height: '100%' }}
              source={{
                uri: selectedLesson.videoUrl,
                headers: {
                  // AQUI USAMOS EL TOKEN RECUPERADO DE SUPABASE
                  Authorization: `Bearer ${token}`,
                },
                overrideFileExtensionAndroid: 'mp4' 
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              onError={(e) => {
                setVideoError(true);
                setVideoLoading(false);
                console.log("Error nativo:", e);
              }}
            />
            
            {videoLoading && !videoError && (
              <View className="absolute inset-0 justify-center items-center bg-black/50 z-10">
                <ActivityIndicator size="large" color="#D4AF37" />
                <Text type="caption1" className="text-white mt-2">Cargando stream...</Text>
              </View>
            )}

            {videoError && (
              <View className="absolute inset-0 justify-center items-center bg-surface z-20">
                <Text type="body" className="text-error font-bold mb-2">No se pudo cargar el video</Text>
                <TouchableOpacity 
                  onPress={() => {
                    const current = selectedLesson;
                    setSelectedLesson(null);
                    setTimeout(() => setSelectedLesson(current), 100);
                  }}
                  className="bg-primary px-4 py-2 rounded-full"
                >
                  <Text type="caption1" className="text-onPrimary font-bold">Reintentar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            {token ? (
              <Text type="body" className="text-textSecondary">Selecciona una lección</Text>
            ) : (
              <ActivityIndicator color="#D4AF37" /> // Cargando token...
            )}
          </View>
        )}
      </View>

      {/* --- DETALLES DE LA LECCIÓN ACTUAL --- */}
      {selectedLesson && (
        <View className="mb-6">
          <Text type="title2" className="text-primary font-bold mb-2">
            {selectedLesson.title}
          </Text>
          <Text type="body" className="text-textSecondary">
            {selectedLesson.description}
          </Text>
        </View>
      )}

      {/* --- LISTA DE LECCIONES --- */}
      <Text type="title3" className="mb-4 text-white">
        {t('courseContent', 'Contenido del curso')}
      </Text>
      
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {lessons.map((lesson) => (
          <TouchableOpacity 
            key={lesson.id} 
            onPress={() => handleSelectLesson(lesson)}
            activeOpacity={0.7}
            className="mb-3"
          >
            <GlassContainer 
              intensity={selectedLesson?.id === lesson.id ? 30 : 10}
              style={{
                padding: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: selectedLesson?.id === lesson.id ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                borderRadius: 12
              }}
            >
              {/* Thumbnail */}
              <View className="h-16 w-24 bg-gray-800 rounded mr-3 overflow-hidden">
                {lesson.thumbnailUrl ? (
                  <Image 
                    source={{ uri: lesson.thumbnailUrl }} 
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                  />
                ) : (
                  <View className="flex-1 justify-center items-center bg-gray-700">
                    <Text type="caption2" className="text-gray-400">No img</Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View className="flex-1">
                <Text 
                  numberOfLines={1} 
                  type="body"
                  className={`font-bold ${
                    selectedLesson?.id === lesson.id ? 'text-primary' : 'text-white'
                  }`}
                >
                  {lesson.title}
                </Text>
                <Text type="caption1" numberOfLines={2} className="text-textSecondary mt-1">
                  {lesson.description}
                </Text>
              </View>

              {/* Indicador de reproducción */}
              {selectedLesson?.id === lesson.id && (
                <View className="ml-2">
                  <ActivityIndicator size="small" color="#D4AF37" animating={videoLoading} />
                </View>
              )}
            </GlassContainer>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}