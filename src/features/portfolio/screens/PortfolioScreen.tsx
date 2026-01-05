import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { useTranslation } from 'react-i18next';
import { PortfolioPnLChart } from '../components/PortfolioPnLChart';
import { PortfolioItem } from '../../../domain/entities/PortfolioItem';

export const PortfolioScreen = () => {
  const { t } = useTranslation('portfolio'); 
  const { portfolio, isLoading } = usePortfolio();

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
    <CollapsibleHeaderLayout title={t('title')}>
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        
        {/* RESUMEN DE BALANCE TOTAL */}
        <View className="bg-card p-6 rounded-[32px] mb-6 border border-outline items-center shadow-sm">
          <Text className="text-secondaryText uppercase text-[10px] font-bold tracking-widest">
            {t('total_balance')}
          </Text>
          <Text className="text-primaryText text-4xl font-black mt-1">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
          <View className={`mt-2 px-3 py-1 rounded-full ${totalPnL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <Text className={`font-bold text-xs ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} total (PnL)
            </Text>
          </View>
        </View>

        {/* GRÁFICA DE PNL (Sin fondo y colores dinámicos) */}
        <PortfolioPnLChart data={portfolio} />

        <Text className="text-black dark:text-white font-bold text-lg mb-4 ml-1">
          {t('your_assets')}
        </Text>

        {portfolio && portfolio.length > 0 ? (
          portfolio.map((item: PortfolioItem) => (
            <View key={item.portfolioId} className="bg-card p-5 rounded-3xl mb-4 border border-outline">
              {/* Encabezado de la Tarjeta de Activo */}
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-primaryText font-black text-xl">{item.assetSymbol}</Text>
                  <Text className="text-secondaryText text-xs font-medium">{item.assetName}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-primaryText font-bold text-lg">
                    ${item.currentTotalValue.toLocaleString()}
                  </Text>
                  <Text className="text-secondaryText font-mono text-[10px]">
                    {item.quantity.toFixed(4)} uds
                  </Text>
                </View>
              </View>

              <View className="h-[1px] bg-outline w-full mb-4 opacity-30" />

              {/* DETALLES: Precio Promedio, Actual y Rendimiento */}
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">
                    {t('avg_price')}
                  </Text>
                  <Text className="text-primaryText font-mono text-xs">${item.avgPrice.toFixed(2)}</Text>
                </View>
                <View className="items-center">
                  <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">
                    {t('current_price')}
                  </Text>
                  <Text className="text-primaryText font-mono text-xs">${item.currentValue.toFixed(2)}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">
                    {t('pnl')}
                  </Text>
                  <Text className={`font-black text-xs ${item.profitOrLossPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {item.profitOrLossPercentage.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          ))
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