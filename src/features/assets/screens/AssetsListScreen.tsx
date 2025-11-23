import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useAssetsList } from '../hooks/useAssetsList';
import { AssetListItem } from '../components/AssetListItem';
import { Text } from '@core/ui/Text';

export const AssetsListScreen = () => {
  const { data: assets, isLoading, refetch, isError, error } = useAssetsList();

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text type="body" weight="medium" color="secondary">
            Cargando assets...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text type="body" weight="medium" color="error">
            Error al cargar assets: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={assets}
          keyExtractor={(item) => item.publicId}
          renderItem={({ item }) => (
            <AssetListItem asset={item} onPress={() => console.log('Abrir asset', item.symbol)} />
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};
