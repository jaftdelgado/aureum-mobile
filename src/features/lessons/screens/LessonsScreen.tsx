import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useLessons } from '../hooks/useLessons';
import { Text } from '@core/ui/Text';
import { GlassContainer } from '@core/ui/GlassContainer';
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
  const [token, setToken] = useState<string | null>(null);
  
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const fetchSessionToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setToken(data.session.access_token);
      }
    };
    fetchSessionToken();
  }, []);

  const videoSource = useMemo(() => {
    if (!selectedLesson?.videoUrl || !token) return null;
    return {
      uri: selectedLesson.videoUrl,
      headers: { Authorization: `Bearer ${token}` },
      overrideFileExtensionAndroid: 'mp4' 
    };
  }, [selectedLesson?.id, token]); 

  const handleSelectLesson = (lesson: Lesson) => {
    if (selectedLesson?.id === lesson.id) return;
    setVideoError(false);
    setVideoLoading(true);
    setSelectedLesson(lesson);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setVideoError(true);
        setVideoLoading(false);
      }
      return;
    }
    if (videoLoading !== status.isBuffering) {
      setVideoLoading(status.isBuffering);
    }
  };

  const handleClosePlayer = () => {
    setSelectedLesson(null);
    setVideoLoading(false);
    setVideoError(false);
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
      {selectedLesson ? (
        <View className="mb-6">
          <View className="w-full aspect-video bg-black rounded-xl overflow-hidden relative justify-center">
            {videoSource && (
              <>
                <Video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%' }}
                  source={videoSource}
                  useNativeControls
                  shouldPlay={true} 
                  resizeMode={ResizeMode.CONTAIN}
                  onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                />
                <TouchableOpacity 
                  onPress={handleClosePlayer}
                  activeOpacity={0.8}
                  className="absolute top-3 right-3 z-30 bg-black/60 w-8 h-8 rounded-full items-center justify-center border border-white/20"
                >
                  <Text className="text-white font-bold">✕</Text>
                </TouchableOpacity>
                {videoLoading && !videoError && (
                  <View className="absolute inset-0 justify-center items-center bg-black/40 z-10">
                    <ActivityIndicator size="large" color="#D4AF37" />
                    <Text type="caption1" className="text-white mt-2">
                      {t('loading_video')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View className="mt-4">
            <Text type="title2" className="text-primary font-bold">{selectedLesson.title}</Text>
            <Text type="body" className="text-textSecondary mt-1">{selectedLesson.description}</Text>
          </View>
        </View>
      ) : (
        <View className="mb-6 py-4">
          <Text type="title1" className="text-white font-bold">
            {t('title')}
          </Text>
          <Text type="body" className="text-textSecondary">
            {t('welcome_subtitle')}
          </Text>
        </View>
      )}

      <Text type="title3" className="mb-4 text-white">
        {t('available_lessons')}
      </Text>
      
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {lessons.map((lesson) => {
          const isSelected = selectedLesson?.id === lesson.id;
          
          return (
            <TouchableOpacity 
              key={lesson.id} 
              onPress={() => handleSelectLesson(lesson)}
              activeOpacity={0.7}
              className="mb-3"
            >
              <GlassContainer 
                intensity={isSelected ? 30 : 10}
                style={{
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isSelected ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  borderRadius: 12
                }}
              >
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

                <View className="flex-1">
                  <Text 
                    numberOfLines={1} 
                    type="body"
                    className={`font-bold ${isSelected ? 'text-primary' : 'text-white'}`}
                  >
                    {lesson.title}
                  </Text>
                  <Text 
                    type="caption1" 
                    numberOfLines={2} 
                    className="text-textSecondary mt-1"
                  >
                    {lesson.description}
                  </Text>
                </View>

                {isSelected && (
                  <View className="ml-2">
                    {videoLoading ? (
                      <ActivityIndicator size="small" color="#D4AF37" />
                    ) : (
                      <View className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </View>
                )}
              </GlassContainer>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}