import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";

import { useAuth } from "@app/providers/AuthProvider";
import { useTeamAssets } from "../hooks/useTeamAssets";
import { useMarketStream } from "../hooks/useMarketStream";
import { useMarketTrading } from "../hooks/useMarketTrading";

import {
  PriceDirection,
  canTrade as canTradeSchema,
  getAssetPublicId,
  getAssetSymbol,
  getUserPublicId,
  normSymbol,
  validateAuth,
  validateSingleSelection,
} from "../schemas/marketSchemas";

import { getMarketErrorMessage } from "../utils/marketErrorMapper";

type UseMarketPresenterResult = {
  mergedAssets: any[];
  selectedIds: string[];
  selectedAsset: any | null;

  isStreamReady: boolean;
  tradeLoading: boolean;
  streamError: Error | null;

  onPressAsset: (assetPublicId: string) => void;
  onBuyPress: () => Promise<void>;
  onSellPress: () => Promise<void>;

  canTrade: boolean;

  refetchAssets?: () => void;
};

export function useMarketPresenter(teamId: string): UseMarketPresenterResult {
  const { t } = useTranslation("market");
  const { user } = useAuth();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { assets: teamAssets, refetch } = useTeamAssets(teamId);

  const { snapshot, error: streamError } = useMarketStream(teamId);
  const { buy, sell, loading: tradeLoading } = useMarketTrading();

  const [isStreamReady, setIsStreamReady] = useState(false);
  useEffect(() => {
    if (snapshot?.assets?.length) setIsStreamReady(true);
  }, [snapshot?.assets?.length]);

  const prevPriceRef = useRef<Record<string, number>>({});
  const [priceDirectionMap, setPriceDirectionMap] = useState<Record<string, PriceDirection>>({});

  useEffect(() => {
    if (!snapshot?.assets?.length) return;

    const nextPrev = { ...prevPriceRef.current };
    const nextDir: Record<string, PriceDirection> = {};

    for (const a of snapshot.assets as any[]) {
      const symbol = normSymbol(a.symbol ?? a.Symbol);
      if (!symbol) continue;

      const prev = prevPriceRef.current[symbol];
      const current = Number(a.price ?? a.Price);

      let dir: PriceDirection = "flat";
      if (typeof prev === "number") {
        if (current > prev) dir = "up";
        else if (current < prev) dir = "down";
      }

      nextDir[symbol] = dir;
      nextPrev[symbol] = current;
    }

    prevPriceRef.current = nextPrev;
    setPriceDirectionMap(nextDir);
  }, [snapshot]);

  const mergedAssets = useMemo(() => {
    const liveBySymbol = new Map<string, number>(
      (snapshot?.assets ?? []).map((a: any) => [
        normSymbol(a.symbol ?? a.Symbol),
        Number(a.price ?? a.Price),
      ])
    );

    return (teamAssets ?? []).map((item: any) => {
      const symbol = normSymbol(getAssetSymbol(item));
      const livePrice = symbol ? liveBySymbol.get(symbol) : undefined;
      const direction: PriceDirection = symbol ? priceDirectionMap[symbol] ?? "flat" : "flat";

      return {
        ...item,
        currentPrice: typeof livePrice === "number" ? livePrice : item.currentPrice,
        priceDirection: direction,
      };
    });
  }, [teamAssets, snapshot, priceDirectionMap]);

  const selectedAsset = useMemo(() => {
    if (selectedIds.length !== 1) return null;
    const id = selectedIds[0];
    return (mergedAssets ?? []).find((a: any) => getAssetPublicId(a) === id) ?? null;
  }, [selectedIds, mergedAssets]);

  const onPressAsset = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
  }, []);

  const requireSelection = useCallback(() => {
    const res = validateSingleSelection(selectedIds);
    if (!res.ok) {
      Alert.alert(t("validation.selectOneAssetTitle"), t("validation.selectOneAssetDesc"));
      return false;
    }
    return true;
  }, [selectedIds, t]);

  const ensureAuth = useCallback(() => {
    const userPublicId = getUserPublicId(user);
    const res = validateAuth(userPublicId);
    if (!res.ok) {
      Alert.alert(t("validation.authRequiredTitle"), t("validation.authRequiredDesc"));
      return null;
    }
    return userPublicId;
  }, [user, t]);

  const onSellPress = useCallback(async () => {
    if (!requireSelection()) return;
    if (!selectedAsset) return;

    const userPublicId = ensureAuth();
    if (!userPublicId) return;

    const quantity = 1;
    const price = selectedAsset.currentPrice ?? 0;

    try {
      await sell({
        teamPublicId: teamId,
        assetPublicId: getAssetPublicId(selectedAsset),
        userPublicId,
        quantity,
        price,
      });

      refetch?.();

      Alert.alert(t("alerts.sellSuccessTitle"), t("alerts.sellSuccessDesc"));
    } catch (e: any) {
      Alert.alert(t("alerts.sellErrorTitle"), getMarketErrorMessage(e, t));
    }
  }, [requireSelection, selectedAsset, ensureAuth, sell, teamId, refetch, t]);

  const onBuyPress = useCallback(async () => {
    if (!requireSelection()) return;
    if (!selectedAsset) return;

    const userPublicId = ensureAuth();
    if (!userPublicId) return;

    const quantity = 1;
    const price = selectedAsset.currentPrice ?? 0;

    try {
      await buy({
        teamPublicId: teamId,
        assetPublicId: getAssetPublicId(selectedAsset),
        userPublicId,
        quantity,
        price,
      });

      refetch?.();

      Alert.alert(t("alerts.buySuccessTitle"), t("alerts.buySuccessDesc"));
    } catch (e: any) {
      Alert.alert(t("alerts.buyErrorTitle"), getMarketErrorMessage(e, t));
    }
  }, [requireSelection, selectedAsset, ensureAuth, buy, teamId, refetch, t]);

  const canTrade = canTradeSchema(selectedIds, selectedAsset);

  return {
    mergedAssets,
    selectedIds,
    selectedAsset,

    isStreamReady,
    tradeLoading,
    streamError: streamError ?? null,

    onPressAsset,
    onBuyPress,
    onSellPress,

    canTrade,

    refetchAssets: refetch,
  };
}
