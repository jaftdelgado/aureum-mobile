import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Button } from '@core/ui/Button';
import { TeamAssetsList } from '@features/assets/components/TeamAssetsList';
import { useTeamAssets } from '@features/assets/hooks/useTeamAssets';
import { AssetsStackParamList } from '@app/navigation/routes-types';

export default function TeamAssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation<NativeStackNavigationProp<AssetsStackParamList>>();
  const route = useRoute<RouteProp<AssetsStackParamList, 'TeamAssets'>>();

  const { teamId } = route.params;

  const { assets: teamAssets, assetPublicIds, refetch, isRefetching } = useTeamAssets(teamId);

  const handleNavigateToAddAssets = () => {
    navigation.navigate('Assets', {
      existingAssetIds: assetPublicIds,
      teamId: teamId,
    });
  };

  return (
    <CollapsibleHeaderLayout title={t('teamAssetsTitle')} onBack={() => navigation.goBack()}>
      <View className="px-4 py-4">
        <Button title={t('addAssets')} onPress={handleNavigateToAddAssets} />
      </View>

      <TeamAssetsList data={teamAssets ?? []} onRefresh={refetch} isRefreshing={isRefetching} />
    </CollapsibleHeaderLayout>
  );
}
