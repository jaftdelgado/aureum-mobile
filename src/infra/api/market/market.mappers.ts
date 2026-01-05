import type { MarketSnapshot, MarketAsset } from "@domain/entities/MarketSnapshot";
import type { TradeResult } from "@domain/entities/Trade";
import type { MarketSnapshotDTO, TradeResultDTO } from "./market.dto";

function toDate(ts: string | number | undefined): Date {
  if (ts === undefined) return new Date();
  if (typeof ts === "number") return new Date(ts);
  const d = new Date(ts);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function mapSnapshot(dto: MarketSnapshotDTO): MarketSnapshot {
  const assetsDto = dto.Assets ?? dto.assets ?? [];
  const assets: MarketAsset[] = assetsDto.map((a) => ({
    id: a.Id ?? a.id ?? "",
    symbol: a.Symbol ?? a.symbol ?? "",
    name: a.Name ?? a.name ?? "",
    price: a.Price ?? a.price ?? 0,
    basePrice: a.BasePrice ?? a.basePrice ?? 0,
    volatility: a.Volatility ?? a.volatility ?? 0,
  }));

  return {
    timestamp: toDate(dto.Timestamp ?? dto.timestamp),
    assets,
  };
}

export function mapTradeResult(dto: TradeResultDTO): TradeResult {
  const notificationsDto = dto.Notifications ?? dto.notifications ?? [];
  return {
    movementPublicId: dto.MovementPublicID ?? dto.movementPublicId ?? "",
    transactionPublicId: dto.TransactionPublicID ?? dto.transactionPublicId ?? "",
    transactionPrice: dto.TransactionPrice ?? dto.transactionPrice ?? 0,
    quantity: dto.Quantity ?? dto.quantity ?? 0,
    notifications: notificationsDto.map((n) => ({
      userPublicId: n.UserPublicId ?? n.userPublicId ?? "",
      message: n.Message ?? n.message ?? "",
    })),
  };
}
