import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { Avatar } from '@core/ui/Avatar';
import { ListItem } from '@core/ui/ListItem';
import { Icon } from '@core/ui/Icon';
import { Image } from 'expo-image';

import { AddIcon } from '../resources/svg/AddIcon';
import { SuccessIcon } from '../resources/svg/SuccessIcon';

export interface Asset {
  publicId: string;
  assetName: string;
  assetSymbol: string;
  assetPicUrl?: string | null;
}

interface AssetsListProps {
  data: Asset[];
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  onPressAsset?: (publicId: string) => void;
  addedAssetIds?: string[];
}

export const AssetsList: React.FC<AssetsListProps> = ({
  data,
  isFetchingNextPage,
  fetchNextPage,
  onPressAsset,
  addedAssetIds = [],
}) => {
  useEffect(() => {
    data.forEach((item) => {
      if (item.assetPicUrl) {
        Image.prefetch(item.assetPicUrl);
      }
    });
  }, [data]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.publicId}
      scrollEnabled={false}
      removeClippedSubviews={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.5}
      renderItem={({ item, index }) => {
        const isAdded = addedAssetIds.includes(item.publicId);

        return (
          <ListItem
            onPress={() => onPressAsset?.(item.publicId)}
            title={item.assetName}
            subtitle={item.assetSymbol}
            isLast={index === data.length - 1}
            leftElement={<Avatar source={item.assetPicUrl} size="md" mode="square" />}
            rightElement={
              isAdded ? (
                <Icon component={SuccessIcon} color="secondaryText" size={20} />
              ) : (
                <Icon component={AddIcon} color="primaryText" size={20} />
              )
            }
          />
        );
      }}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" className="mt-4" /> : null
      }
    />
  );
};
