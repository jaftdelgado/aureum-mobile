import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MarketConfigApiRepository } from '@infra/api/market-config/MarketConfigApiRepository';
import { CreateMarketConfigUseCase } from '@domain/use-cases/market-config/CreateMarketConfigUseCase';
import { UpdateMarketConfigUseCase } from '@domain/use-cases/market-config/UpdateMarketConfigUseCase';
import type { MarketConfig } from '@domain/entities/MarketConfig';

const repository = new MarketConfigApiRepository();
const createUseCase = new CreateMarketConfigUseCase(repository);
const updateUseCase = new UpdateMarketConfigUseCase(repository);

export const useSaveMarketConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (config: MarketConfig) => {
            if (config.publicId && config.publicId.length > 0) {
                return await updateUseCase.execute(config);
            } else {
                return await createUseCase.execute(config);
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['market-config', variables.teamId] });
        },
    });
};
