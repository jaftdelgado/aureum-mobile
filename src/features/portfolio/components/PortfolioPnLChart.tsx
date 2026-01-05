import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { PortfolioItem } from '../../../domain/entities/PortfolioItem';

interface Props {
  data: PortfolioItem[];
}

export const PortfolioPnLChart: React.FC<Props> = ({ data }) => {
  const barData = data
    .filter(item => item.quantity > 0)
    .map(item => {
      const isProfit = item.profitOrLoss >= 0;
      return {
        value: Math.abs(item.profitOrLoss),
        label: item.assetSymbol,
        frontColor: isProfit ? '#10b981' : '#ef4444',
        topLabelComponent: () => (
          <Text style={{ fontSize: 8, color: '#000000', marginBottom: 4, fontWeight: 'bold' }}>
            {isProfit ? '+' : '-'}${Math.abs(item.profitOrLoss).toFixed(0)}
          </Text>
        ),
      };
    })
    .sort((a, b) => b.value - a.value);

  if (barData.length === 0) return null;

  return (
    <View className="mb-6 p-4 rounded-3xl border border-outline bg-white shadow-sm">
      <Text className="text-[10px] font-bold uppercase mb-6 text-center tracking-widest text-black">
        Ganancias y Pérdidas por Activo
      </Text>
      <BarChart
        data={barData}
        barWidth={35}
        spacing={20}
        roundedTop
        hideRules
        hideAxesAndRules
        backgroundColor="white" 
        xAxisThickness={0}
        yAxisThickness={0}
        xAxisLabelTextStyle={{ color: '#000000', fontSize: 10, fontWeight: '500' }}
        width={Dimensions.get('window').width - 80}
        isAnimated
      />
    </View>
  );
};