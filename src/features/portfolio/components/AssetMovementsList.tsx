import React from 'react';
import { View, Text } from 'react-native';
import { HistoryItem } from '../../../domain/entities/HistoryItem';
import { useTranslation } from 'react-i18next';

interface Props {
  movements: HistoryItem[];
  assetSymbol: string;
}

export const AssetMovementsList = ({ movements, assetSymbol }: Props) => {
  const { t } = useTranslation('portfolio');

  if (movements.length === 0) {
    return (
      <View className="py-6 items-center">
        <Text className="text-secondaryText text-xs">{t('history.empty')}</Text>
      </View>
    );
  }

  return (
    <View className="mt-2 space-y-3">
      <Text className="text-primaryText font-bold text-sm mb-2">
        {t('history.title', { symbol: assetSymbol })}
      </Text>
      {movements.map((mov) => {
        const isBuy = mov.type === 'Compra';
        const isProfit = mov.realizedPnl >= 0;

        return (
          <View key={mov.movementId} className="bg-bg border border-outline p-4 rounded-2xl mb-3">
            <View className="flex-row justify-between items-center mb-3">
              <View className={`px-2 py-1 rounded-md ${isBuy ? 'bg-blue-500/10' : 'bg-purple-500/10'}`}>
                <Text className={`text-[10px] font-bold ${isBuy ? 'text-blue-500' : 'text-purple-500'}`}>
                  {isBuy ? `↓ ${t('history.type.buy')}` : `↑ ${t('history.type.sell')}`}
                </Text>
              </View>
              <Text className="text-secondaryText text-[10px] font-mono">
                {new Date(mov.date).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-secondaryText text-[10px]">{t('history.price')}</Text>
              <Text className="text-primaryText font-mono text-[11px]">${mov.price.toFixed(2)}</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-secondaryText text-[10px]">{t('history.quantity')}</Text>
              <Text className="text-primaryText font-mono text-[11px] font-bold">{mov.quantity}</Text>
            </View>

            <View className="h-[1px] bg-outline w-full my-2 opacity-20 border-dashed" />

            <View className="flex-row justify-between items-center">
              <Text className="text-secondaryText text-[10px] font-bold">{t('history.total')}</Text>
              <Text className="text-primaryText font-bold text-xs">${mov.totalAmount.toLocaleString()}</Text>
            </View>

            {mov.type === 'Venta' && (
              <View className={`mt-3 p-2 rounded-lg flex-row justify-between items-center ${isProfit ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                <Text className="text-secondaryText text-[9px] font-bold">{t('history.pnl_realized')}</Text>
                <Text className={`font-black text-[11px] ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfit ? '↗' : '↘'} ${mov.realizedPnl.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};