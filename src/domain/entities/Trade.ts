export interface TradeNotification {
  userPublicId: string;
  message: string;
}

export interface TradeResult {
  movementPublicId: string;
  transactionPublicId: string;
  transactionPrice: number;
  quantity: number;
  notifications: TradeNotification[];
}
