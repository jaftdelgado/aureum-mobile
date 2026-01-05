import { Alert } from "react-native";
import type { TFunction } from "i18next";

export type PriceDirection = "up" | "down" | "flat";

export type TradeContext = {
  teamId: string;
  selectedIds: string[];
  selectedAsset: any | null; 
  user: any | null;      
};

export type TradeDeps = {
  t: TFunction;
  getAssetPublicId: (item: any) => string;
  getUserPublicId: (user: any) => string;
};

export function requireSelection(ctx: TradeContext, t: TFunction): boolean {
  if (!ctx.selectedIds?.length) {
    Alert.alert(
      t("select_one_asset", "Selecciona un activo"),
      t("select_one_asset_desc", "Debes seleccionar un activo para operar.")
    );
    return false;
  }
  return true;
}

export function ensureAuth(user: any | null, t: TFunction, getUserPublicId: (u: any) => string) {
  const userPublicId = user ? getUserPublicId(user) : "";
  if (!userPublicId) {
    Alert.alert(
      t("auth_required", "Inicia sesión"),
      t("auth_required_desc", "Necesitas sesión activa para operar.")
    );
    return null;
  }
  return userPublicId;
}

export function requireSelectedAsset(selectedAsset: any | null): boolean {
  return !!selectedAsset;
}

export function buildTradeParams(
  ctx: TradeContext,
  deps: TradeDeps,
  overrides?: Partial<{ quantity: number; price: number }>
) {
  if (!requireSelection(ctx, deps.t)) return null;
  if (!requireSelectedAsset(ctx.selectedAsset)) return null;

  const userPublicId = ensureAuth(ctx.user, deps.t, deps.getUserPublicId);
  if (!userPublicId) return null;

  const assetPublicId = deps.getAssetPublicId(ctx.selectedAsset);
  if (!assetPublicId) return null;

  const quantity = overrides?.quantity ?? 1;
  const price = overrides?.price ?? Number(ctx.selectedAsset?.currentPrice ?? 0);

  return {
    teamPublicId: ctx.teamId,
    assetPublicId,
    userPublicId,
    quantity,
    price,
  };
}

export function normSymbol(s: any) {
  return String(s ?? "").trim().toUpperCase();
}

export function getAssetPublicId(item: any): string {
  return (
    item?.asset?.publicId ||
    item?.asset?.public_id ||
    item?.asset_public_id ||
    item?.assetPublicId ||
    item?.publicId ||
    item?.id ||
    ""
  );
}

export function getUserPublicId(user: any): string {
  return (
    user?.publicId ||
    user?.public_id ||
    user?.userPublicId ||
    user?.user_public_id ||
    user?.id ||
    ""
  );
}

export function getAssetSymbol(item: any): string {
  return (
    item?.asset?.assetSymbol ||
    item?.asset?.symbol ||
    item?.assetSymbol ||
    item?.symbol ||
    ''
  );
}

export function validateSingleSelection(selectedIds: string[]) {
  if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
    return { ok: false as const, code: 'NO_SELECTION' as const };
  }
  if (selectedIds.length !== 1) {
    return { ok: false as const, code: 'INVALID_SELECTION' as const };
  }
  return { ok: true as const };
}

export function validateAuth(userPublicId: string) {
  if (!userPublicId) return { ok: false as const, code: 'NO_AUTH' as const };
  return { ok: true as const };
}

export function canTrade(selectedIds: string[], selectedAsset: any) {
  return selectedIds.length === 1 && !!selectedAsset;
}
