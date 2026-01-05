import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Button } from '@core/ui/Button';
import { AssetsList } from '@features/assets/components/AssetsList';
import { useAssetsList } from '@features/assets/hooks/useAssetsList';
import { useSyncTeamAssets } from '@features/assets/hooks/useSyncTeamAssets';
import { AssetsStackParamList } from '@app/navigation/routes-types';

export default function AssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AssetsStackParamList, 'Assets'>>();

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

  const handleSave = () => {
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
        isFetchingNextPage={isFetchingNextPage}>
        <AssetsList
          data={assets}
          isFetchingNextPage={isFetchingNextPage}
          addedAssetIds={selectedIds}
          onPressAsset={handlePressAsset}
        />

        <View className="h-24" />
      </CollapsibleHeaderLayout>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-4 pb-8">
        <Button
          title={t('saveChanges')}
          onPress={handleSave}
          isLoading={isSaving}
          disabled={isSaving}
        />
      </View>
    </View>
  );
}
