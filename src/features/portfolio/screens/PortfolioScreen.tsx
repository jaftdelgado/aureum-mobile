import React from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import  CollapsibleHeaderLayout  from '@app/components/screen-header/CollapsibleHeaderLayout';
import { useTranslation } from 'react-i18next';

export const PortfolioScreen = () => {
  const { t } = useTranslation('portfolio');
  const { portfolio, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <CollapsibleHeaderLayout title={t('title')}>
      <View className="p-4">
        {portfolio && portfolio.length > 0 ? (
          // Usamos .map en lugar de FlatList para evitar el error de listas anidadas
          portfolio.map((item) => (
            <View key={item.portfolioId} className="bg-card p-4 rounded-xl mb-3 border border-outline">
              <View className="flex-row justify-between mb-2">
                <Text className="text-primaryText font-bold text-lg">{item.assetSymbol}</Text>
                <Text className="text-primaryText font-mono">{item.quantity.toFixed(4)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-secondaryText text-sm">{item.assetName}</Text>
                <Text className={item.profitOrLoss >= 0 ? "text-green-500" : "text-red-500"}>
                  {item.profitOrLossPercentage.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-center text-secondaryText mt-10">{t('empty')}</Text>
        )}
      </View>
    </CollapsibleHeaderLayout>
  );
};