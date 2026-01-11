import React from 'react';
import { View } from 'react-native';
import { HistoryItem } from '@domain/entities/HistoryItem';
import { useTranslation } from 'react-i18next';
import { Text } from '@core/ui/Text';
import { ListContainer } from '@core/ui/ListContainer';

interface Props {
  movements: HistoryItem[];
  assetSymbol: string;
}

export const AssetMovementsList = ({ movements, assetSymbol }: Props) => {
  const { t } = useTranslation('portfolio');

  if (movements.length === 0) {
    return (
      <View className="items-center py-6">
        <Text type="caption1" color="secondary">
          {t('history.empty')}
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-2 space-y-3">
      <Text type="subhead" weight="bold" className="mb-2">
        {t('history.title', { symbol: assetSymbol })}
      </Text>

      {movements.map((mov) => {
        const isBuy = mov.type === 'Compra';
        const isProfit = mov.realizedPnl >= 0;

        return (
          <ListContainer key={mov.movementId} className="mb-3">
            <View className="p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <View className={`rounded-md px-2 py-1 ${isBuy ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                  <Text
                    type="caption2"
                    weight="bold"
                    className={isBuy ? 'text-blue-500' : 'text-purple-500'}
                  >
                    {isBuy ? `↓ ${t('history.type.buy')}` : `↑ ${t('history.type.sell')}`}
                  </Text>
                </View>
                <Text type="caption2" color="secondary" className="font-mono">
                  {new Date(mov.date).toLocaleDateString()}
                </Text>
              </View>

              <View className="mb-2 flex-row justify-between">
                <Text type="caption2" color="secondary">
                  {t('history.price')}
                </Text>
                <Text type="caption1" className="font-mono">
                  ${mov.price.toFixed(2)}
                </Text>
              </View>

              <View className="mb-2 flex-row justify-between">
                <Text type="caption2" color="secondary">
                  {t('history.quantity')}
                </Text>
                <Text type="caption1" weight="bold" className="font-mono">
                  {mov.quantity}
                </Text>
              </View>

              <View className="bg-outline my-2 h-[1px] w-full border-dashed opacity-20" />

              <View className="flex-row items-center justify-between">
                <Text type="caption2" weight="bold" color="secondary">
                  {t('history.total')}
                </Text>
                <Text type="caption1" weight="bold">
                  ${mov.totalAmount.toLocaleString()}
                </Text>
              </View>

              {mov.type === 'Venta' && (
                <View className={`mt-3 flex-row items-center justify-between rounded-lg p-2 ${isProfit ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                  <Text type="caption2" weight="bold" color="secondary">
                    {t('history.pnl_realized')}
                  </Text>
                  <Text
                    type="caption1"
                    weight="bold"
                    color={isProfit ? 'success' : 'error'}
                  >
                    {isProfit ? '↗' : '↘'} ${mov.realizedPnl.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </ListContainer>
        );
      })}
    </View>
  );
};