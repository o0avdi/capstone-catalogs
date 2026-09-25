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

export type MetricState = 'positive' | 'negative' | 'neutral';
export type ValueFormat = 'currency' | 'percent' | 'number' | 'compact';
/** Percent values use ratios (0.24 = 24%). State describes favorability, not direction. */
export interface MetricData {
  label: string;
  value: number | string;
  format?: ValueFormat;
  subtitle?: string;
  change?: number | string;
  changeFormat?: ValueFormat;
  state?: MetricState;
  helper?: string;
  icon?: string;
}
export interface TransactionData {
  id: string;
  date: string;
  description: string;
  category: string;
  /** Positive is an inflow; negative is an outflow. */
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}
export interface FinancialSummaryData {
  revenue: number;
  expenses: number;
  expenseBudget?: number;
}
export interface ReportingPeriod {
  id: string;
  label: string;
  comparisonLabel?: string;
  metrics: MetricData[];
  chartData: TimeSeriesPoint[];
  transactions: TransactionData[];
  summary?: FinancialSummaryData;
}
export interface ExecutiveDashboardConfig {
  title: string;
  subtitle?: string;
  currency?: string;
  locale?: string;
  periods: ReportingPeriod[];
  sourceNote?: string;
}
