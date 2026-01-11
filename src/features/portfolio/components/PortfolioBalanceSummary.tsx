import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@core/ui/Text';
import { ListContainer } from '@core/ui/ListContainer';

interface PortfolioBalanceSummaryProps {
  totalBalance: number;
  totalPnL: number;
}

export const PortfolioBalanceSummary = ({
  totalBalance,
  totalPnL,
}: PortfolioBalanceSummaryProps) => {
  const { t } = useTranslation('portfolio');

  return (
    <ListContainer className="mb-6">
      <View className="items-center p-6">
        <Text
          type="caption2"
          weight="bold"
          color="secondary"
          align="center"
          className="mb-1 uppercase tracking-widest">
          {t('total_balance')}
        </Text>

        <Text type="display" weight="bold" align="center" className="mt-1 text-4xl font-black">
          $
          {totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <View
          className={`mt-2 rounded-full px-3 py-1 ${totalPnL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          <Text type="caption1" weight="bold" color={totalPnL >= 0 ? 'success' : 'error'}>
            {totalPnL >= 0 ? '+' : ''}
            {totalPnL.toFixed(2)} total (PnL)
          </Text>
        </View>
      </View>
    </ListContainer>
  );
};
