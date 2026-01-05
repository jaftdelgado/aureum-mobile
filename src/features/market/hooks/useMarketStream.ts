import { useEffect, useMemo, useState } from "react";
import { MarketApiRepository } from "@infra/api/market/MarketApiRepository";
import { SubscribeToMarketUseCase } from "@domain/use-cases/market/SubscribeToMarketUseCase";
import type { MarketSnapshot } from "@domain/entities/MarketSnapshot";

export function useMarketStream(teamPublicId: string) {
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const useCase = useMemo(() => {
    const repo = new MarketApiRepository();
    return new SubscribeToMarketUseCase(repo);
  }, []);

  useEffect(() => {
    if (!teamPublicId) return;

    const unsubscribe = useCase.execute(teamPublicId, {
      onData: setSnapshot,
      onError: (e) => setError(e),
    });

    return unsubscribe;
  }, [teamPublicId, useCase]);

  return { snapshot, error };
}
