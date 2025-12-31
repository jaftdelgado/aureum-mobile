import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Text } from '@core/ui/Text';
import { useLessons } from '../hooks/useLessons';
import { lessonsRepository } from "@app/di";
import { Lesson } from '@domain/entities/Lesson';

export default function LessonsScreen() {
  const { lessons, isLoading } = useLessons();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950 p-4">
      {selectedLesson && (
        <View className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6">
          <Video
            source={{ uri: lessonsRepository.getVideoUrl(selectedLesson.id) }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            className="w-full h-full"
          />
        </View>
      )}

      <Text className="text-2xl font-bold text-white mb-4">Lecciones Disponibles</Text>
      
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => setSelectedLesson(item)}
            className={`flex-row p-3 mb-3 rounded-lg border ${selectedLesson?.id === item.id ? 'bg-indigo-500/10 border-indigo-500' : 'bg-zinc-900 border-zinc-800'}`}
          >
            {item.thumbnailUrl && (
              <Image 
                source={{ uri: item.thumbnailUrl }} 
                className="w-20 h-20 rounded-md bg-zinc-800"
              />
            )}
            <View className="flex-1 ml-3 justify-center">
              <Text className="text-white font-bold text-lg" numberOfLines={1}>{item.title}</Text>
              <Text className="text-zinc-400 text-sm" numberOfLines={2}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}