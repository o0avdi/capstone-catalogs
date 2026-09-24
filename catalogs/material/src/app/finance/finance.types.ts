/** Local, illustrative finance data shapes used by the catalog. */
export interface TimeSeriesPoint {
  date: string;
  value: number;
  benchmark?: number;
}
export interface AllocationPoint {
  category: string;
  value: number;
}
export interface PnlPoint {
  period: string;
  revenue: number;
  expenses: number;
}
export interface OhlcPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
export interface RiskReturnPoint {
  asset: string;
  return: number;
  volatility: number;
  allocation: number;
}
