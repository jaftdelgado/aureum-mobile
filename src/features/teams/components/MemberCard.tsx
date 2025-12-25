import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@core/ui/Text';
import { Avatar } from '@core/ui/Avatar';
import { IconButton } from '@core/ui/IconButton';
import { TeamMember } from '../../../domain/entities/TeamMember';
import { TrashIcon } from '../resources/svg/TrashIcon'; 

interface MemberCardProps {
  member: TeamMember;
  isProfessorView: boolean;
  onRemove?: (memberId: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ 
  member, 
  isProfessorView, 
  onRemove 
}) => {
  const { t } = useTranslation('teams');

  const dateToFormat = member.joinedAt ? new Date(member.joinedAt) : new Date();
  const formattedDate = dateToFormat.toLocaleDateString();

  return (
    <View className="flex-row items-center justify-between p-4 bg-white rounded-xl mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row items-center flex-1 gap-3">
        <Avatar 
          source={member.avatarUrl}  
          placeholderText={member.name.charAt(0)} 
          size="md" 
        />
        
        <View className="flex-1">
          <Text type="body" weight="bold" numberOfLines={1}>
            {member.name}
          </Text>
          {member.joinedAt && (
            <Text type="caption1" color="secondary">
              {t('members.since', { date: formattedDate })}
            </Text>
          )}
        </View>
      </View>

      {isProfessorView && member.role !== 'professor' && (
        <IconButton 
          icon={TrashIcon} 
          variant="ghost"
          className="text-red-500" 
          onPress={() => onRemove?.(member.id)}
        />
      )}
    </View>
  );
};