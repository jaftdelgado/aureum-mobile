import type { TFunction } from "i18next";

export function getMarketErrorMessage(error: unknown, t: TFunction): string {
  const err = error instanceof Error ? error : new Error(String(error));
  const msg = String(err.message ?? "");

  if (msg.includes("ASSET_NOT_OWNED")) {
    return t("errors.assetNotOwned");
  }
  if (msg.includes("INSUFFICIENT_ASSET_QUANTITY")) {
    return t("errors.insufficientQuantity");
  }
  if (msg.includes("INVALID_QUANTITY")) {
    return t("errors.invalidQuantity");
  }

  if (msg.includes("Network request failed") || msg.includes("XHR network error")) {
    return t("errors.noInternet");
  }

  return t("errors.generic");
}
