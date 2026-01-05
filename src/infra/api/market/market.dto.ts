export type MarketAssetDTO = {
  Id?: string;
  Symbol?: string;
  Name?: string;
  Price?: number;
  BasePrice?: number;
  Volatility?: number;

  id?: string;
  symbol?: string;
  name?: string;
  price?: number;
  basePrice?: number;
  volatility?: number;
};

export type MarketSnapshotDTO = {
  Timestamp?: string | number;
  Assets?: MarketAssetDTO[];

  timestamp?: string | number;
  assets?: MarketAssetDTO[];
};

export type TradeNotificationDTO = {
  UserPublicId?: string;
  Message?: string;

  userPublicId?: string;
  message?: string;
};

export type TradeResultDTO = {
  MovementPublicID?: string;
  TransactionPublicID?: string;
  TransactionPrice?: number;
  Quantity?: number;
  Notifications?: TradeNotificationDTO[];

  movementPublicId?: string;
  transactionPublicId?: string;
  transactionPrice?: number;
  quantity?: number;
  notifications?: TradeNotificationDTO[];
};
