import { useMemo, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { portfolioRepository } from '../../../app/di'; 
import { useAuth } from '../../../app/providers/AuthProvider'; 
import { useRoute, RouteProp } from '@react-navigation/native'; 
import { SelectedTeamStackParamList } from '../../../app/navigation/teams/SelectedTeamNavigator';
import { useMarketStream } from '../../market/hooks/useMarketStream'; 

export const usePortfolio = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<SelectedTeamStackParamList, 'Portfolio'>>();
  const team = route.params?.team; 

  const [staticPrices, setStaticPrices] = useState<Record<string, number> | null>(null);

  const streamId = staticPrices ? '' : (team?.public_id || '');
  const { snapshot } = useMarketStream(streamId);

  useEffect(() => {
    if (snapshot && !staticPrices) {
      const pricesMap: Record<string, number> = {};
      snapshot.assets.forEach(asset => {
        pricesMap[asset.id] = asset.price;
      });
      setStaticPrices(pricesMap);
    }
  }, [snapshot, staticPrices]);

  const portfolioQuery = useQuery({
    queryKey: ['portfolio', team?.public_id, user?.id],
    queryFn: () => portfolioRepository.getByCourse(team!.public_id, user!.id),
    enabled: !!team?.public_id && !!user?.id,
    staleTime: 7000, 
  });

  const historyQuery = useQuery({
    queryKey: ['portfolioHistory', team?.public_id, user?.id],
    queryFn: () => portfolioRepository.getHistory(team!.public_id, user!.id),
    enabled: !!team?.public_id && !!user?.id,
    staleTime: 7000,
  });

  const enrichedPortfolio = useMemo(() => {
    const baseData = portfolioQuery.data ?? [];
    if (!staticPrices) return baseData;

    return baseData.map((item) => {
      const marketPrice = staticPrices[item.assetId] ?? item.currentValue;
      const currentTotalValue = item.quantity * marketPrice;
      const totalInvestment = item.quantity * item.avgPrice;
      const profitOrLoss = currentTotalValue - totalInvestment;

      return {
        ...item,
        currentValue: marketPrice,
        currentTotalValue,
        profitOrLoss,
        profitOrLossPercentage: totalInvestment !== 0 ? (profitOrLoss / totalInvestment) * 100 : 0,
      };
    });
  }, [portfolioQuery.data, staticPrices]);

  return {
    portfolio: enrichedPortfolio,
    history: historyQuery.data ?? [],
    isLoading: portfolioQuery.isLoading || (!staticPrices && !portfolioQuery.isError),
    isError: portfolioQuery.isError || historyQuery.isError,
    refetch: () => {
      setStaticPrices(null); 
      portfolioQuery.refetch();
      historyQuery.refetch();
    }
  };
};