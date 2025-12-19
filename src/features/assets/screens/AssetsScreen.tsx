import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { AssetsList } from '../components/AssetsList';
import { useAssetsList } from '../hooks/useAssetsList';

export default function AssetsScreen() {
  const { t } = useTranslation('assets');
  const navigation = useNavigation();

  const { data, isFetchingNextPage, fetchNextPage } = useAssetsList();

  const assets = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
      onEndReached={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}>
      <AssetsList
        data={assets}
        isFetchingNextPage={isFetchingNextPage}
        onPressAsset={(id) => console.log('Tapped asset:', id)}
      />
    </CollapsibleHeaderLayout>
  );
}
