export type Currency = "USD" | "EUR" | "MXN";
export type Volatility = "High" | "Medium" | "Low" | "Disabled";
export type ThickSpeed = "High" | "Medium" | "Low";
export type TransactionFee = "High" | "Medium" | "Low" | "Disabled";

export interface MarketConfig {
  publicId: string;
  teamId: string;
  createdAt?: Date;
  updatedAt?: Date;

  initialCash: number;
  currency: Currency;
  marketVolatility: Volatility;
  marketLiquidity: Volatility;
  thickSpeed: ThickSpeed;
  transactionFee: TransactionFee;
  eventFrequency: TransactionFee;
  dividendImpact: TransactionFee;
  crashImpact: TransactionFee;
  allowShortSelling: boolean;
}
