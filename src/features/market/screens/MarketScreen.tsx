import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp, useTheme } from '@react-navigation/native';

import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { Text } from '@core/ui/Text';
import { Button } from '@core/ui/Button';

import { MarketHeaderActions } from '../components/MarketHeaderActions';
import { TeamAssetsList } from '../components/TeamAssetsList';
import { MarketStackParamList } from '../navigation/MarketNavigator';
import { useMarketPresenter } from '../hooks/useMarketPresenter';
import { AssetHistoryChart } from '../components/AssetHistoryChart';

export default function MarketScreen() {
  const { t } = useTranslation('market');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MarketStackParamList, 'Market'>>();
  const { teamId } = route.params;

  const { colors } = useTheme();

  const {
    mergedAssets,
    selectedIds,
    selectedAsset,
    isStreamReady,
    tradeLoading,
    streamError,
    canTrade,
    onPressAsset,
    onBuyPress,
    onSellPress,
  } = useMarketPresenter(teamId);

  const handleSettings = () => {
    (navigation as any).navigate('MarketSettings', { teamId });
  };
  const handlePlay = () => {};

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
      rightAction={
        <MarketHeaderActions onSettingsPress={handleSettings} onPlayPress={handlePlay} />
      }>
      {!isStreamReady ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            paddingVertical: 24,
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-3 text-secondaryText">{t('status.loadingMarket')}</Text>
        </View>
      ) : (
        <View className="gap-6">
          <Text className="text-center text-secondaryText">{t('welcome_message')}</Text>

          {streamError ? (
            <View className="px-4">
              <Text className="text-center text-red-500">
                {t('errors.stream')}: {streamError.message}
              </Text>
            </View>
          ) : null}

          <View className="flex-row gap-3 p-4">
            <View className="flex-1">
              <Button
                title={t('actions.sell')}
                variant="secondary"
                onPress={onSellPress}
                size="md"
                disabled={!canTrade || tradeLoading}
              />
            </View>

            <View className="flex-1">
              <Button
                title={t('actions.buy')}
                variant="primary"
                onPress={onBuyPress}
                size="md"
                disabled={!canTrade || tradeLoading}
              />
            </View>
          </View>

          {/* ✅ Chart: usa selectedAsset del presenter */}
          {selectedAsset?.history?.length ? (
            <View className="px-4">
              <AssetHistoryChart asset={selectedAsset} />
            </View>
          ) : null}

          <View>
            <Text className="mb-2 px-4 text-lg font-bold text-primaryText">
              {t('labels.marketAssets')}
            </Text>

            <TeamAssetsList
              data={mergedAssets ?? []}
              selectedAssetIds={selectedIds}
              onPressAsset={onPressAsset}
            />
          </View>
        </View>
      )}
    </CollapsibleHeaderLayout>
  );
}
