import React, { useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { usePortfolio } from '../hooks/usePortfolio';
import CollapsibleHeaderLayout from '@app/components/screen-header/CollapsibleHeaderLayout';
import { useTranslation } from 'react-i18next';
import { PortfolioPnLChart } from '../components/PortfolioPnLChart';
import { PortfolioItem } from '../../../domain/entities/PortfolioItem';
import { AssetMovementsList } from '../components/AssetMovementsList';
import { useNavigation } from '@react-navigation/native';

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
        
        {/* RESUMEN DE BALANCE TOTAL (Ahora reacciona al vivo) */}
        <View className="bg-card p-6 rounded-[32px] mb-6 border border-outline items-center shadow-sm">
          {/* Eliminamos el punto verde y el pulse */}
          <Text className="text-secondaryText uppercase text-[10px] font-bold tracking-widest mb-1">
            {t('total_balance')}
          </Text>

          <Text className="text-primaryText text-4xl font-black mt-1">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          
          <View className={`mt-2 px-3 py-1 rounded-full ${totalPnL >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <Text className={`font-bold text-xs ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
               {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} total (PnL)
            </Text>
          </View>
        </View>

        {/* GRÁFICA DE PNL (También se actualiza con los datos del stream) */}
        <PortfolioPnLChart data={portfolio} />

        <Text className="text-black dark:text-white font-bold text-lg mb-4 ml-1">
          {t('your_assets')}
        </Text>

        {portfolio && portfolio.length > 0 ? (
          portfolio.map((item: PortfolioItem) => {
            const isSelected = selectedAssetId === item.assetId;
            const assetHistory = history.filter(h => h.assetId === item.assetId);

            return (
              <View key={item.portfolioId}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => setSelectedAssetId(isSelected ? null : item.assetId)}
                  className={`bg-card p-5 rounded-3xl mb-4 border ${isSelected ? 'border-primaryBtn' : 'border-outline'}`}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View>
                      <Text className="text-primaryText font-black text-xl">{item.assetSymbol}</Text>
                      <Text className="text-secondaryText text-xs font-medium">{item.assetName}</Text>
                    </View>
                    <View className="items-end">
                      {/* Precio Total de la posición en vivo */}
                      <Text className="text-primaryText font-bold text-lg">
                        ${item.currentTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Text>
                      <Text className="text-secondaryText font-mono text-[10px]">
                        {item.quantity.toFixed(4)} uds
                      </Text>
                    </View>
                  </View>

                  <View className="h-[1px] bg-outline w-full mb-4 opacity-30" />

                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">{t('avg_price')}</Text>
                      <Text className="text-primaryText font-mono text-xs">${item.avgPrice.toFixed(2)}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">{t('current_price')}</Text>
                      {/* Precio Unitario en vivo */}
                      <Text className="text-primaryText font-mono text-xs">${item.currentValue.toFixed(2)}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-secondaryText text-[9px] uppercase font-bold mb-1">{t('pnl')}</Text>
                      {/* Porcentaje en vivo */}
                      <Text className={`font-black text-xs ${item.profitOrLossPercentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {item.profitOrLossPercentage.toFixed(2)}%
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <View className="mt-4 pt-4 border-t border-outline border-dashed">
                       <AssetMovementsList 
                          movements={assetHistory} 
                          assetSymbol={item.assetSymbol} 
                       />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
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