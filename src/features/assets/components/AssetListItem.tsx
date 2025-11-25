import React from 'react';
import { View } from 'react-native';
import { ListItem } from '@core/ui/ListItem';
import { Asset } from '@domain/entities/Asset';
import { Text } from '@core/ui/Text';
import { Avatar } from '@core/ui/Avatar';

interface AssetListItemProps {
  asset: Asset;
  onPress?: () => void;
}

export const AssetListItem = ({ asset, onPress }: AssetListItemProps) => {
  return (
    <ListItem onPress={onPress} className="flex-row items-center">
      <Avatar
        source={asset.imageUrl ? { uri: asset.imageUrl } : null}
        mode="square"
        size="md"
        placeholderText={asset.symbol[0]}
      />

      <View className="ml-4 flex-1">
        <Text type="body" weight="bold" color="default">
          {asset.symbol}
        </Text>
        <Text type="caption1" weight="regular" color="secondary">
          {asset.name}
        </Text>
      </View>

      {asset.basePrice !== undefined && (
        <Text type="body" weight="semibold" color="default">
          ${asset.basePrice.toFixed(2)}
        </Text>
      )}
    </ListItem>
  );
};
