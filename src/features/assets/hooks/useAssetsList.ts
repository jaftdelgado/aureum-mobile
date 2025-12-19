import { useInfiniteQuery } from '@tanstack/react-query';
import type { Asset } from '@domain/entities/Asset';
import { useAssetsFilters } from '@features/assets/hooks/useAssetsFilters';
import { AssetApiRepository } from '@infra/api/assets/AssetApiRepository';
import { GetAssetsUseCase } from '@domain/use-cases/assets/GetAssetsUseCase';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

const assetRepository = new AssetApiRepository();
const getAssetsUseCase = new GetAssetsUseCase(assetRepository);

export const useAssetsList = (selectedAssetIds: string[] = [], options?: { enabled?: boolean }) => {
  const { perPage, search, sortKey, sortDir } = useAssetsFilters();

  return useInfiniteQuery<PaginatedResult<Asset>, Error>({
    queryKey: ['assets', perPage, search, sortKey, sortDir, selectedAssetIds],

    initialPageParam: 1,

    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;

      const dto: {
        page: number;
        limit: number;
        search?: string;
        orderByAssetName?: 'asc' | 'desc';
        orderByBasePrice?: 'asc' | 'desc';
        selectedAssetIds?: string[];
      } = { page, limit: perPage };

      if (search) dto.search = search;
      if (sortKey === 'assetName') dto.orderByAssetName = sortDir ?? undefined;
      if (sortKey === 'basePrice') dto.orderByBasePrice = sortDir ?? undefined;
      if (selectedAssetIds.length) dto.selectedAssetIds = selectedAssetIds;

      return getAssetsUseCase.execute(dto);
    },

    getNextPageParam: (lastPage) => {
      const next = lastPage.meta.currentPage + 1;
      return next <= lastPage.meta.totalPages ? next : undefined;
    },

    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};
