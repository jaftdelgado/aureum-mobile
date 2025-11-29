import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useAssetsList } from '../hooks/useAssetsList';
import { AssetListItem } from '../components/AssetListItem';
import { AssetCard } from '../components/AssetCard';
import { Text } from '@core/ui/Text';
import { useDynamicDock } from '@app/dock/hooks/useDynamicDock';

export const AssetsListScreen = () => {
  const { data: assets, isLoading, refetch, isError, error } = useAssetsList();
  const { showForm, hide } = useDynamicDock();

  return (
    <View className="flex-1 bg-bg">
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
            <AssetListItem
              asset={item}
              onPress={() => {
                // Abrimos el AssetCard con botones de cancel y submit
                showForm({
                  component: () => <AssetCard asset={item} />,
                  onCancel: () => hide(), // cierra el card
                  onSubmit: () => console.log('Submit del card'),
                  submitLabel: 'Continuar',
                });
              }}
            />
          )}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};
