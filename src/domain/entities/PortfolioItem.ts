export interface PortfolioItem {
  userId: string;
  portfolioId: number;
  assetId: string;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  assetName: string;
  assetSymbol: string;
  totalInvestment: number;
  currentTotalValue: number;
  profitOrLoss: number;
  profitOrLossPercentage: number;
}