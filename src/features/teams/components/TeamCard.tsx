import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Team } from '../../../domain/entities/Team';
import { Text } from '@core/ui/Text';

interface TeamCardProps {
  team: Team;
  onPress: (team: Team) => void;
  role?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onPress, role }) => {
  const isProfessor = role === 'professor';

  const coverImage = `https://source.unsplash.com/random/800x600?education,technology&sig=${team.publicId}`;

  return (
    <TouchableOpacity 
      onPress={() => onPress(team)}
      className="bg-white rounded-xl mb-5 shadow-sm border border-gray-200 overflow-hidden elevation-2"
      activeOpacity={0.9}
    >
      <View className="h-32 bg-gray-200 relative">
        <Image 
          source={{ uri: coverImage }} 
          className="w-full h-full absolute"
          resizeMode="cover"
        />
        <View className="w-full h-full bg-black/10 absolute" />
        
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md">
          <Text type="caption2" weight="bold" className="text-primary">
            GRATIS
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text type="title3" weight="bold" numberOfLines={1} className="text-gray-900">
              {team.name}
            </Text>
            
            <Text type="caption1" color="secondary" className="mt-1">
              `Código: {team.accessCode}`
            </Text>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 my-3" />

        <View className="flex-row items-center justify-between">

          <View className="flex-row items-center">
            <Text type="caption2" className="text-primary font-bold mr-1">
              {isProfessor ? 'GESTIONAR' : 'ENTRAR'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};