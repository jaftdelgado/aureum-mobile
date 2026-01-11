import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PortfolioItem } from '@domain/entities/PortfolioItem';
import { AssetMovementsList } from './AssetMovementsList';
import { HistoryItem } from '@domain/entities/HistoryItem';
import { Text } from '@core/ui/Text';
import { ListContainer } from '@core/ui/ListContainer';

interface PortfolioAssetCardProps {
  item: PortfolioItem;
  isSelected: boolean;
  onPress: () => void;
  history: HistoryItem[];
}

export const PortfolioAssetCard = ({
  item,
  isSelected,
  onPress,
  history,
}: PortfolioAssetCardProps) => {
  const { t } = useTranslation('portfolio');

  return (
    <View>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <ListContainer className={`mb-4 ${isSelected ? 'border-primaryBtn' : ''}`}>
          <View className="p-5">
            <View className="mb-4 flex-row items-start justify-between">
              <View>
                <Text type="headline" weight="bold">
                  {item.assetSymbol}
                </Text>
                <Text type="caption1" weight="medium" color="secondary">
                  {item.assetName}
                </Text>
              </View>
              <View className="items-end">
                <Text type="headline" weight="bold">
                  ${item.currentTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
                <Text type="caption2" color="secondary" className="font-mono">
                  {item.quantity.toFixed(4)} uds
                </Text>
              </View>
            </View>

            <View className="bg-outline mb-4 h-[1px] w-full opacity-30" />

            <View className="flex-row justify-between">
              <View>
                <Text type="caption2" weight="bold" color="secondary" className="mb-1 uppercase">
                  {t('avg_price')}
                </Text>
                <Text type="caption1" className="font-mono">
                  ${item.avgPrice.toFixed(2)}
                </Text>
              </View>
              <View className="items-center">
                <Text type="caption2" weight="bold" color="secondary" className="mb-1 uppercase">
                  {t('current_price')}
                </Text>
                <Text type="caption1" className="font-mono">
                  ${item.currentValue.toFixed(2)}
                </Text>
              </View>
              <View className="items-end">
                <Text type="caption2" weight="bold" color="secondary" className="mb-1 uppercase">
                  {t('pnl')}
                </Text>
                <Text
                  type="caption1"
                  weight="bold"
                  color={item.profitOrLossPercentage >= 0 ? 'success' : 'error'}>
                  {item.profitOrLossPercentage.toFixed(2)}%
                </Text>
              </View>
            </View>

            {isSelected && (
              <View className="border-outline mt-4 border-t border-dashed pt-4">
                <AssetMovementsList movements={history} assetSymbol={item.assetSymbol} />
              </View>
            )}
          </View>
        </ListContainer>
      </TouchableOpacity>
    </View>
  );
};
