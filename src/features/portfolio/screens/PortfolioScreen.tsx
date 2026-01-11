import React, { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { useTranslation } from 'react-i18next';
import { PortfolioPnLChart } from '../components/PortfolioPnLChart';
import { PortfolioItem } from '@domain/entities/PortfolioItem';
import { useNavigation } from '@react-navigation/native';
import { PortfolioBalanceSummary } from '../components/PortfolioBalanceSummary';
import { PortfolioAssetCard } from '../components/PortfolioAssetCard';

export const PortfolioScreen = () => {
  const { t } = useTranslation('portfolio');
  const navigation = useNavigation();
  const { portfolio, history, isLoading } = usePortfolio();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const { totalBalance, totalPnL } = useMemo(() => {
    return {
      totalBalance: portfolio.reduce((acc, curr) => acc + curr.currentTotalValue, 0),
      totalPnL: portfolio.reduce((acc, curr) => acc + curr.profitOrLoss, 0)
    };
  }, [portfolio]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <CollapsibleHeaderLayout
      title={t('title')}
      onBack={() => navigation.goBack()}
    >
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>

        <PortfolioBalanceSummary totalBalance={totalBalance} totalPnL={totalPnL} />

        <PortfolioPnLChart data={portfolio} />

        <Text className="text-black dark:text-white font-bold text-lg mb-4 ml-1">
          {t('your_assets')}
        </Text>

        {portfolio && portfolio.length > 0 ? (
          portfolio.map((item: PortfolioItem) => {
            const isSelected = selectedAssetId === item.assetId;
            const assetHistory = history.filter(h => h.assetId === item.assetId);

            return (
              <PortfolioAssetCard
                key={item.portfolioId}
                item={item}
                isSelected={isSelected}
                onPress={() => setSelectedAssetId(isSelected ? null : item.assetId)}
                history={assetHistory}
              />
            );
          })
        ) : (
          <View className="py-10 items-center">
            <Text className="text-secondaryText">{t('empty')}</Text>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </CollapsibleHeaderLayout>
  );
};