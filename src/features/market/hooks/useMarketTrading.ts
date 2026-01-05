import { useMemo, useState } from "react";
import { MarketApiRepository } from "@infra/api/market/MarketApiRepository";
import { BuyAssetUseCase } from "@domain/use-cases/market/BuyAssetUseCase";
import { SellAssetUseCase } from "@domain/use-cases/market/SellAssetUseCase";
import type { TradeParams } from "@domain/repositories/MarketRepository";
import type { TradeResult } from "@domain/entities/Trade";

export function useMarketTrading() {
  const [lastTrade, setLastTrade] = useState<TradeResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const { buyUseCase, sellUseCase } = useMemo(() => {
    const repo = new MarketApiRepository();
    return {
      buyUseCase: new BuyAssetUseCase(repo),
      sellUseCase: new SellAssetUseCase(repo),
    };
  }, []);

  async function buy(params: TradeParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await buyUseCase.execute(params);
      setLastTrade(res);
      return res;
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function sell(params: TradeParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await sellUseCase.execute(params);
      setLastTrade(res);
      return res;
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { buy, sell, loading, error, lastTrade };
}
