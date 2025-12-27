import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { AssetsList } from '@features/assets/components/AssetsList';
import { useAssetsList } from '@features/assets/hooks/useAssetsList';

export default function AssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isFetchingNextPage, fetchNextPage } = useAssetsList();
  const assets = data?.pages.flatMap((page) => page.data) ?? [];

  const handlePressAsset = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((assetId) => assetId !== id);
      }
      return [...prev, id];
    });

    console.log('Tapped asset:', id);
  };

  return (
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
    </CollapsibleHeaderLayout>
  );
}
