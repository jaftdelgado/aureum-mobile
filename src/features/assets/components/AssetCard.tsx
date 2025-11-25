import React from 'react';
import { View } from 'react-native';
import { Text } from '@core/ui/Text';
import { Avatar } from '@core/ui/Avatar';
import { Asset } from '@domain/entities/Asset';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  return (
    <View className="flex-row items-center rounded-2xl bg-card ">
      <Avatar
        source={asset.imageUrl ? { uri: asset.imageUrl } : null}
        mode="square"
        size="lg"
        placeholderText={asset.symbol[0]}
        style={{ marginRight: 16 }}
      />

      <View className="flex-1">
        <Text type="body" weight="bold" color="default">
          {asset.symbol}
        </Text>
        <Text type="caption1" weight="regular" color="secondary" style={{ marginBottom: 4 }}>
          {asset.name}
        </Text>

        {asset.basePrice !== undefined && (
          <Text type="body" weight="semibold" color="default">
            ${asset.basePrice.toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  );
};
