import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { AssetsList } from '@features/assets/components/AssetsList';
import { AssetsSelectionFooter } from '@features/assets/components/AssetsSelectionFooter';
import { useAssetsList } from '@features/assets/hooks/useAssetsList';
import { useSyncTeamAssets } from '@features/assets/hooks/useSyncTeamAssets';
import { AssetsStackParamList } from '@app/navigation/routes-types';

export default function AssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AssetsStackParamList, 'Assets'>>();
  const isModal = true;

  const teamId = route.params?.teamId;
  const initialIds = route.params?.existingAssetIds ?? [];

  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const { data, isFetchingNextPage, fetchNextPage } = useAssetsList(initialIds);
  const { mutate: syncAssets, isPending: isSaving } = useSyncTeamAssets();

  const assets = data?.pages.flatMap((page) => page.data) ?? [];

  const handlePressAsset = (id: string) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id) ? prev.filter((assetId) => assetId !== id) : [...prev, id];
      return newIds;
    });
  };

  const hasChanges = useMemo(() => {
    if (selectedIds.length !== initialIds.length) return true;

    const initialSet = new Set(initialIds);
    return !selectedIds.every((id) => initialSet.has(id));
  }, [selectedIds, initialIds]);

  const isButtonDisabled = isSaving || selectedIds.length === 0 || !hasChanges;

  const handleSave = () => {
    if (!teamId) return;

    syncAssets(
      { teamId, selectedAssetIds: selectedIds },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      }
    );
  };

  return (
    <View className="flex-1">
      <CollapsibleHeaderLayout
        title={t('title')}
        onBack={() => navigation.goBack()}
        onEndReached={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isModal={isModal}>
        <AssetsList
          data={assets}
          isFetchingNextPage={isFetchingNextPage}
          addedAssetIds={selectedIds}
          onPressAsset={handlePressAsset}
        />
        <View className="h-24" />
      </CollapsibleHeaderLayout>

      <AssetsSelectionFooter
        title={t('saveChanges')}
        onPress={handleSave}
        isLoading={isSaving}
        disabled={isButtonDisabled}
      />
    </View>
  );
}
