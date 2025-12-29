import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useAuth } from '@app/providers/AuthProvider';
import { GetTeamMembersUseCase } from '../../../domain/use-cases/teams/GetTeamMembersUseCase';
import { RemoveMemberUseCase } from '../../../domain/use-cases/teams/RemoveMemberUseCase';
import { teamsRepository } from '../../../app/di'; 
import { TeamMember } from '../../../domain/entities/TeamMember';
import { getUserFriendlyErrorMessage } from '@core/utils/errorMapper';

export const useTeamMembers = (teamId: string) => {
  const { t } = useTranslation('teams');
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isProfessor = user?.role === 'professor';

  const fetchMembers = useCallback(async () => {
    try {
      const useCase = new GetTeamMembersUseCase(teamsRepository);
      const data = await useCase.execute(teamId);

      const sorted = data.sort((a, b) => {
        if (a.role === 'professor') return -1;
        if (b.role === 'professor') return 1;
        const nameA = a.name ?? '';
        const nameB = b.name ?? '';
        
        return nameA.localeCompare(nameB);
      });

      setMembers(sorted);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [teamId]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const load = async () => {
        setLoading(true);
        if (isActive) await fetchMembers();
      };
      load();
      return () => { isActive = false; };
    }, [fetchMembers])
  );

  const onRefresh = async () => {
      setRefreshing(true);
      await fetchMembers();
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (!isProfessor) return;
    Alert.alert(
      t('members.remove_confirm_title'),
      t('members.remove_confirm_desc', { name: memberName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const useCase = new RemoveMemberUseCase(teamsRepository);
              await useCase.execute(teamId, memberId);
              setMembers(prev => prev.filter(m => m.id !== memberId));
              Alert.alert(t('common.success'), t('members.remove_success'));
            } catch (error) {
              console.error('Error removing member:', error);
              const msg = getUserFriendlyErrorMessage(error, t);
              Alert.alert(t('common.error'), msg);
              
              fetchMembers();
            }
          }
        }
      ]
    );
  };

  return {
    members,
    loading,
    refreshing,
    isProfessor,
    handleRemoveMember,
    onRefresh: fetchMembers
  };
};