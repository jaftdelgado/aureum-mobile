import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';
import { MarketHeaderActions } from '../components/MarketHeaderActions';
import { useTeamAssets } from '../hooks/useTeamAssets';
import { TeamAssetsList } from '../components/TeamAssetsList';
import { MarketStackParamList } from '../navigation/MarketNavigator';

export default function MarketScreen() {
  const { t } = useTranslation('market');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MarketStackParamList, 'Market'>>();

  const { teamId } = route.params;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const {
    assets: teamAssets,
    refetch,
    isRefetching,
  } = useTeamAssets(teamId);

  const handleSettings = () => { };
  const handlePlay = () => { };

  const handleSell = () => { };
  const handleBuy = () => { };

  const handlePressAsset = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((assetId) => assetId !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
      rightAction={
        <MarketHeaderActions onSettingsPress={handleSettings} onPlayPress={handlePlay} />
      }
    >
      <View className="gap-6">
        <Text className="text-center text-secondaryText">{t('welcome_message')}</Text>

        <View className="flex-row gap-3 p-4">
          <View className="flex-1">
            <Button
              title={t('sell', 'Vender')}
              variant="secondary"
              onPress={handleSell}
              size="md"
            />
          </View>
          <View className="flex-1">
            <Button title={t('buy', 'Comprar')} variant="primary" onPress={handleBuy} size="md" />
          </View>
        </View>

        <View>
          <Text className="text-lg font-bold text-primaryText px-4 mb-2">
            {t('market-assets', 'Activos del mercado')}
          </Text>
          <TeamAssetsList
            data={teamAssets ?? []}
            selectedAssetIds={selectedIds}
            onPressAsset={handlePressAsset}
          />
        </View>
      </View>
    </CollapsibleHeaderLayout>
  );
}
