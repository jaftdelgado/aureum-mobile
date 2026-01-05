import React, { useEffect } from 'react';
import { FlatList, Text, RefreshControl, View } from 'react-native';
import { Avatar } from '@core/ui/Avatar';
import { ListItem } from '@core/ui/ListItem';
import { Image } from 'expo-image';
import type { TeamAsset } from '@domain/entities/TeamAsset';

interface TeamAssetsListProps {
  data: TeamAsset[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TeamAssetsList: React.FC<TeamAssetsListProps> = ({
  data,
  onRefresh,
  isRefreshing = false,
}) => {
  useEffect(() => {
    data.forEach((item) => {
      if (item.asset.assetPicUrl) {
        Image.prefetch(item.asset.assetPicUrl);
      }
    });
  }, [data]);

  const renderRightElement = (item: TeamAsset) => {
    return (
      <View className="items-end">
        <Text className="font-bold text-primaryText">${item.currentPrice.toFixed(2)}</Text>
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
        onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined
      }
      renderItem={({ item, index }) => {
        return (
          <ListItem
            title={item.asset.assetName}
            subtitle={item.asset.assetSymbol}
            isLast={index === data.length - 1}
            leftElement={<Avatar source={item.asset.assetPicUrl} size="md" mode="square" />}
            rightElement={renderRightElement(item)}
          />
        );
      }}
    />
  );
};
