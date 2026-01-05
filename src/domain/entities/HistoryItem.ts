export interface HistoryItem {
  movementId: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  quantity: number;
  price: number;
  totalAmount: number;
  type: 'Compra' | 'Venta';
  realizedPnl: number;
  date: string;
}