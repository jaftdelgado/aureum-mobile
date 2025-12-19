import React, { useEffect } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import { Avatar } from '@core/ui/Avatar';
import { Text } from '@core/ui/Text';
import { ListItem } from '@core/ui/ListItem';
import { Image } from 'expo-image';

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
}

export const AssetsList: React.FC<AssetsListProps> = ({
  data,
  isFetchingNextPage,
  fetchNextPage,
  onPressAsset,
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
      renderItem={({ item }) => (
        <ListItem
          onPress={() => onPressAsset?.(item.publicId)}
          swipeLeftActions={[
            {
              label: 'Agregar',
              onPress: () => console.log(item.assetPicUrl),
              color: '#4CAF50',
              textColor: '#fff',
              width: 80,
            },
          ]}>
          <View className="flex-row items-center">
            <Avatar source={item.assetPicUrl} size="md" mode="square" className="mr-3" />

            <View>
              <Text type="body" weight="medium">
                {item.assetName}
              </Text>
              <Text type="subhead" color="secondary">
                {item.assetSymbol}
              </Text>
            </View>
          </View>
        </ListItem>
      )}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator size="small" className="mt-4" /> : null
      }
    />
  );
};
