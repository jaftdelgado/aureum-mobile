import { useQuery } from '@tanstack/react-query';
import { GetAssetsUseCase } from '@domain/use-cases/assets/GetAssetsUseCase';
import { AssetsApiRepository } from '@infra/api/assets/AssetsApiRepository';
import { Asset } from '@domain/entities/Asset';

const assetsRepository = new AssetsApiRepository();
const getAssetsUseCase = new GetAssetsUseCase(assetsRepository);

export const useAssetsList = () => {
  return useQuery<Asset[], Error>({
    queryKey: ['assets'],
    queryFn: () => getAssetsUseCase.execute(),
  });
};
