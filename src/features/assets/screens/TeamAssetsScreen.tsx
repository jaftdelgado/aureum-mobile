import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { TeamAssetsList } from '@features/assets/components/TeamAssetsList';
import { useTeamAssets } from '@features/assets/hooks/useTeamAssets';
import { AssetsStackParamList } from '@app/navigation/routes-types';

export default function TeamAssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AssetsStackParamList, 'TeamAssets'>>();

  const { teamId } = route.params;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    assets: teamAssets,
    isLoading,
    refetch,
    isRefetching,
  } = useTeamAssets(teamId);

  const handlePressAsset = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((assetId) => assetId !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <CollapsibleHeaderLayout
      title={t('team_assets_title', { defaultValue: 'Cartera' })}
      onBack={() => navigation.goBack()}>
      <TeamAssetsList
        data={teamAssets ?? []}
        selectedAssetIds={selectedIds}
        onPressAsset={handlePressAsset}
        onRefresh={refetch}
        isRefreshing={isRefetching}
      />
    </CollapsibleHeaderLayout>
  );
}
