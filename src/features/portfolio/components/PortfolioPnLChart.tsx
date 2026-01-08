import React, { useMemo, useEffect, useRef, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { PortfolioItem } from '../../../domain/entities/PortfolioItem';
import { useTranslation } from 'react-i18next';

interface Props {
  data: PortfolioItem[];
}

export const PortfolioPnLChart: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation('portfolio');
  const barData = useMemo(() => {
    return data
      .filter(item => item.quantity > 0)
      .map(item => {
        const isProfit = item.profitOrLoss >= 0;
        return {
          value: Math.abs(item.profitOrLoss),
          label: item.assetSymbol,
          frontColor: isProfit ? '#10b981' : '#ef4444',
          topLabelComponent: () => (
            <Text style={{ fontSize: 8, color: '#6b7280', marginBottom: 4, fontWeight: 'bold' }}>
             {isProfit ? '+' : '-'}${Math.abs(item.profitOrLoss).toFixed(0)}
            </Text>
          ),
        };
      })
      .sort((a, b) => b.value - a.value); 
  }, [data]);

  const prevDataRef = useRef<PortfolioItem[]>([]);
  const [pulseColor, setPulseColor] = useState<Record<string, string>>({});

  useEffect(() => {
    const newPulseColors: Record<string, string> = {};
    let hasChanges = false;

    data.forEach(item => {
      const prevItem = prevDataRef.current.find(p => p.assetId === item.assetId);
      if (prevItem && prevItem.currentValue !== item.currentValue) {
        const isUp = item.currentValue > prevItem.currentValue;
        newPulseColors[item.assetSymbol] = isUp ? '#4ade80' : '#f87171'; 
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setPulseColor(newPulseColors);
      const timer = setTimeout(() => setPulseColor({}), 500);
      return () => clearTimeout(timer);
    }

    prevDataRef.current = data;
  }, [data]);

  if (barData.length === 0) return null;

  return (
    <View className="mb-6 p-4 rounded-3xl border border-outline bg-card shadow-sm">
      <Text className="text-[10px] font-bold uppercase tracking-widest text-secondaryText mb-6 text-center">
        {t('chart_title')}
      </Text>
      <BarChart
        data={barData}
        barWidth={35}
        spacing={20}
        roundedTop
        hideRules
        hideAxesAndRules
        backgroundColor="transparent" 
        xAxisThickness={0}
        yAxisThickness={0}
        xAxisLabelTextStyle={{ color: '#9ca3af', fontSize: 10, fontWeight: '500' }}
        width={Dimensions.get('window').width - 80}
        isAnimated 
      />
    </View>
  );
};