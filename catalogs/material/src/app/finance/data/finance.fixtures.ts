import {
  ExecutiveDashboardConfig,
  ReportingPeriod,
  TimeSeriesPoint,
  TransactionData,
} from '../finance.types';

/** Synthetic ledger aggregates. Every completed row reconciles to the chart and KPI totals. */
function makePeriod(
  id: string,
  label: string,
  startMonth: number,
  revenue: number[],
  expenses: number[],
  priorRevenue: number,
  priorExpenses: number,
  expenseBudget: number,
): ReportingPeriod {
  const totalRevenue = revenue.reduce((sum, value) => sum + value, 0);
  const totalExpenses = expenses.reduce((sum, value) => sum + value, 0);
  const profit = totalRevenue - totalExpenses;
  const priorProfit = priorRevenue - priorExpenses;
  const margin = profit / totalRevenue;
  const priorMargin = priorProfit / priorRevenue;
  const change = (value: number, prior: number) => (value - prior) / Math.abs(prior);
  const chartData: TimeSeriesPoint[] = revenue.map((value, i) => ({
    date: `2026-${String(startMonth + i).padStart(2, '0')}-01`,
    value,
    benchmark: expenses[i],
  }));
  const transactions: TransactionData[] = chartData.flatMap((point, i) => [
    {
      id: `${id}-revenue-${i}`,
      date: point.date.slice(0, 7) + '-24',
      description: 'Enterprise subscriptions — monthly settlement',
      category: 'Subscription revenue',
      amount: point.value,
      status: 'completed',
    },
    {
      id: `${id}-payroll-${i}`,
      date: point.date.slice(0, 7) + '-25',
      description: 'Payroll and employee benefits',
      category: 'People',
      amount: -Math.round(expenses[i] * 0.6),
      status: 'completed',
    },
    {
      id: `${id}-operations-${i}`,
      date: point.date.slice(0, 7) + '-26',
      description: 'Cloud infrastructure, software and operating services',
      category: 'Operations',
      amount: -(expenses[i] - Math.round(expenses[i] * 0.6)),
      status: 'completed',
    },
  ]);
  transactions.push({
    id: `${id}-pending`,
    date: chartData[2].date.slice(0, 7) + '-28',
    description: 'Annual software renewal — awaiting approval',
    category: 'Operations',
    amount: -8200,
    status: 'pending',
  });
  transactions.push({
    id: `${id}-failed`,
    date: chartData[2].date.slice(0, 7) + '-27',
    description: 'Vendor payment — bank details require review',
    category: 'Operations',
    amount: -1450,
    status: 'failed',
  });
  const revenueChange = change(totalRevenue, priorRevenue),
    expenseChange = change(totalExpenses, priorExpenses),
    profitChange = change(profit, priorProfit);
  return {
    id,
    label,
    comparisonLabel: 'vs. previous quarter',
    chartData,
    transactions,
    summary: { revenue: totalRevenue, expenses: totalExpenses, expenseBudget },
    metrics: [
      {
        label: 'Total revenue',
        value: totalRevenue,
        change: revenueChange,
        state: revenueChange >= 0 ? 'positive' : 'negative',
        icon: '$',
      },
      {
        label: 'Net profit',
        value: profit,
        change: profitChange,
        state: profitChange >= 0 ? 'positive' : 'negative',
        icon: '↗',
      },
      {
        label: 'Expenses',
        value: totalExpenses,
        change: expenseChange,
        state: expenseChange <= 0 ? 'positive' : 'negative',
        icon: '↘',
      },
      {
        label: 'Profit margin',
        value: margin,
        format: 'percent',
        change: `${margin >= priorMargin ? '+' : ''}${((margin - priorMargin) * 100).toFixed(1)} pp`,
        state: margin >= priorMargin ? 'positive' : 'negative',
        icon: '%',
      },
    ],
  };
}

const q1 = makePeriod(
  'q1',
  'Q1 2026 · Jan – Mar',
  1,
  [370000, 390000, 410000],
  [282000, 286000, 291000],
  1080000,
  840000,
  900000,
);
const q2 = makePeriod(
  'q2',
  'Q2 2026 · Apr – Jun',
  4,
  [425000, 448000, 467000],
  [298000, 302000, 315000],
  1170000,
  859000,
  950000,
);
const growth = makePeriod(
  'growth',
  'Q3 2026 · Growth scenario',
  7,
  [490000, 545000, 610000],
  [306000, 315000, 326000],
  1340000,
  915000,
  1000000,
);
const pressure = makePeriod(
  'pressure',
  'Q3 2026 · Expense pressure',
  7,
  [430000, 420000, 435000],
  [350000, 380000, 400000],
  1340000,
  915000,
  1000000,
);
const base = {
  title: 'Executive dashboard',
  subtitle: 'A clear view of revenue, profitability and the cost of running your business.',
  currency: 'USD',
  locale: 'en-US',
  sourceNote:
    'Illustrative data · synthetic monthly ledger aggregates. Pending and failed entries are excluded from totals.',
};
export const overviewConfig: ExecutiveDashboardConfig = { ...base, periods: [q2, q1] };
export const growthConfig: ExecutiveDashboardConfig = { ...base, periods: [growth, q2] };
export const pressureConfig: ExecutiveDashboardConfig = { ...base, periods: [pressure, q2] };
export const emptyConfig: ExecutiveDashboardConfig = { ...base, periods: [] };
export const emptyPeriodConfig: ExecutiveDashboardConfig = {
  ...base,
  periods: [
    { id: 'empty', label: 'Q4 2026 · No data', metrics: [], chartData: [], transactions: [] },
  ],
};
