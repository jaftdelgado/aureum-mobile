import { useQuery } from '@tanstack/react-query';
import { MarketConfigApiRepository } from '@infra/api/market-config/MarketConfigApiRepository';
import { GetMarketConfigUseCase } from '@domain/use-cases/market-config/GetMarketConfigUseCase';
import type { MarketConfig } from '@domain/entities/MarketConfig';
import { defaultMarketConfig } from '@features/market/constants/defaultMarketConfig';

const marketConfigRepository = new MarketConfigApiRepository();
const getMarketConfigUseCase = new GetMarketConfigUseCase(marketConfigRepository);

export const useMarketConfig = (teamPublicId: string) => {
  if (!teamPublicId) {
    return {
      data: defaultMarketConfig,
      isSuccess: true,
      isFetching: false,
      isError: false,
      isLoading: false,
    } as const;
  }

  return useQuery<MarketConfig, Error>({
    queryKey: ['market-config', teamPublicId],
    queryFn: async () => {
      try {
        return await getMarketConfigUseCase.execute(teamPublicId);
      } catch {
        return defaultMarketConfig;
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!teamPublicId,
  });
};
