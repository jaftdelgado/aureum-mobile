import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Team } from '../../../domain/entities/Team';
import { Text } from '@core/ui/Text';
import { useTeamImage } from '../hooks/useTeamImage';
import { useTranslation } from 'react-i18next';

interface TeamCardProps {
  team: Team;
  onPress: (team: Team) => void;
  role?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onPress, role }) => {
  const { t } = useTranslation('teams');
  const isProfessor = role === 'professor';

  const { imageSource, loading } = useTeamImage(team.public_id, team.team_pic);

  const defaultImage = `https://source.unsplash.com/random/800x600?technology,code&sig=${team.public_id}`;
  
  const finalSource = imageSource ? { uri: imageSource } : { uri: defaultImage };

  return (
    <TouchableOpacity 
      onPress={() => onPress(team)}
      className="bg-white rounded-xl mb-5 shadow-sm border border-gray-200 overflow-hidden elevation-2"
      activeOpacity={0.9}
    >
      <View className="h-36 bg-gray-200 relative">
        <Image 
          source={finalSource} 
          className="w-full h-full absolute"
          resizeMode="cover"
        />
        <View className="w-full h-full bg-black/20 absolute" />
        
        <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md shadow-sm">
          <Text type="caption2" weight="bold" className="text-primary uppercase">
            {isProfessor ? t('card.professor') : t('card.student')}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="mb-2">
          <Text type="title3" weight="bold" numberOfLines={1} className="text-gray-900">
            {team.name}
          </Text>
          
          {team.description && (
            <Text type="caption1" color="secondary" numberOfLines={2} className="mt-1">
              {team.description}
            </Text>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
};