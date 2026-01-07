export type Currency = 'USD' | 'EUR' | 'MXN';
export type Volatility = 'High' | 'Medium' | 'Low' | 'Disabled';
export type ThickSpeed = 'High' | 'Medium' | 'Low';
export type TransactionFee = 'High' | 'Medium' | 'Low' | 'Disabled';

export interface MarketConfigDTO {
  public_id: string;
  team_id: string;
  initial_cash: number;
  currency: Currency;
  market_volatility: Volatility;
  market_liquidity: Volatility;
  thick_speed: ThickSpeed;
  transaction_fee: TransactionFee;
  event_frequency: TransactionFee;
  dividend_impact: TransactionFee;
  crash_impact: TransactionFee;
  allow_short_selling: boolean;
  created_at?: string;
  updated_at?: string;
}
