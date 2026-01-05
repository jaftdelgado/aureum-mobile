import React, { useEffect, useCallback } from 'react';
import { FlatList, RefreshControl, View, Text as RNText } from 'react-native';
import { Avatar } from '@core/ui/Avatar';
import { ListItem } from '@core/ui/ListItem';
import { Icon } from '@core/ui/Icon';
import { Image } from 'expo-image';
import type { TeamAsset } from '@domain/entities/TeamAsset';

import { SuccessIcon } from '../resources/svg/SuccessIcon';

type PriceDirection = 'up' | 'down' | 'flat';
type TeamAssetWithDirection = TeamAsset & { priceDirection?: PriceDirection };

interface TeamAssetsListProps {
  data: TeamAsset[];
  onPressAsset?: (assetPublicId: string) => void; 
  selectedAssetIds?: string[]; 
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TeamAssetsList: React.FC<TeamAssetsListProps> = ({
  data,
  onPressAsset,
  selectedAssetIds = [],
  onRefresh,
  isRefreshing = false,
}) => {
  useEffect(() => {
    data.forEach((item) => {
      if (item.asset.assetPicUrl) Image.prefetch(item.asset.assetPicUrl);
    });
  }, [data]);

  const getAssetPublicId = useCallback((item: any): string => {
    return (
      item?.asset?.publicId ||
      item?.asset?.public_id ||
      item?.assetPublicId ||
      item?.asset_public_id ||
      item?.asset?.id || 
      ''
    );
  }, []);

  const renderRightElement = (itemRaw: TeamAsset, isSelected: boolean) => {
    const item = itemRaw as TeamAssetWithDirection;

    if (isSelected) {
      return <Icon component={SuccessIcon} color="secondaryText" size={20} />;
    }

    const direction = item.priceDirection ?? 'flat';
    const color =
      direction === 'up' ? '#22c55e' : direction === 'down' ? '#ef4444' : '#E5E7EB';
    const arrow = direction === 'up' ? ' ↑' : direction === 'down' ? ' ↓' : '';

    return (
      <View style={{ alignItems: 'flex-end' }}>
        <RNText style={{ fontWeight: '700', fontSize: 16, color }}>
          ${Number(item.currentPrice ?? 0).toFixed(2)}{arrow}
        </RNText>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.publicId}
      scrollEnabled={false}
      removeClippedSubviews={false}
      contentContainerStyle={{ paddingBottom: 16 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      renderItem={({ item, index }) => {
        const assetPublicId = getAssetPublicId(item); 
        const isSelected = selectedAssetIds.includes(assetPublicId); 

        return (
          <ListItem
            onPress={() => onPressAsset?.(assetPublicId)} 
            title={item.asset.assetName}
            subtitle={item.asset.assetSymbol}
            isLast={index === data.length - 1}
            leftElement={<Avatar source={item.asset.assetPicUrl} size="md" mode="square" />}
            rightElement={renderRightElement(item, isSelected)}
          />
        );
      }}
    />
  );
};
