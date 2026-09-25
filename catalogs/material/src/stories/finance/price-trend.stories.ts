import { overviewConfig } from '../../app/finance/data/finance.fixtures';
import type { Meta, StoryObj } from '@storybook/angular';
import { PriceTrendChartComponent } from '../../app/finance/components/price-trend-chart.component';
import { TimeSeriesPoint } from '../../app/finance/finance.types';
const basic: TimeSeriesPoint[] = [
  { date: '2026-01-01', value: 100 },
  { date: '2026-02-01', value: 104 },
  { date: '2026-03-01', value: 102 },
  { date: '2026-04-01', value: 109 },
  { date: '2026-05-01', value: 112 },
];
const meta: Meta<PriceTrendChartComponent> = {
  title: 'Finance/Components/Performance Chart',
  component: PriceTrendChartComponent,
  tags: ['autodocs'],
  parameters: {
    controls: {
      include: [
        'data',
        'title',
        'seriesLabel',
        'comparisonLabel',
        'format',
        'currency',
        'locale',
        'chartType',
        'zeroBaseline',
      ],
    },
    layout: 'padded',
    docs: {
      description: {
        component:
          'The existing PriceTrendChart extended with configurable series labels, formatting, line/bar modes, empty state and an accessible data table. Vega-Lite specifications are rendered by the shared VegaChart wrapper.',
      },
    },
  },
  args: {
    data: basic,
    title: 'Portfolio value',
    seriesLabel: 'Portfolio',
    comparisonLabel: 'Benchmark',
    format: 'currency',
    currency: 'USD',
    locale: 'en-US',
    chartType: 'line',
    zeroBaseline: false,
  },
  argTypes: {
    chartType: { control: 'inline-radio', options: ['line', 'bar'] },
    format: { control: 'select', options: ['currency', 'percent', 'number', 'compact'] },
    data: { control: 'object' },
  },
};
export default meta;
type Story = StoryObj<PriceTrendChartComponent>;
export const Basic: Story = {};
export const WithBenchmark: Story = {
  args: {
    title: 'Portfolio vs. benchmark',
    data: basic.map((p, i) => ({ ...p, benchmark: [100, 101, 103, 105, 106][i] })),
  },
};
export const VolatilePeriod: Story = {
  args: {
    data: [
      { date: '2026-01-01', value: 100 },
      { date: '2026-02-01', value: 111 },
      { date: '2026-03-01', value: 96 },
      { date: '2026-04-01', value: 106 },
      { date: '2026-05-01', value: 101 },
    ],
  },
};

export const RevenueAndExpenses: Story = {
  args: {
    data: overviewConfig.periods[0].chartData,
    title: 'Revenue and expenses',
    seriesLabel: 'Revenue',
    comparisonLabel: 'Expenses',
    zeroBaseline: true,
  },
};
export const GroupedBars: Story = { args: { ...RevenueAndExpenses.args, chartType: 'bar' } };
export const Empty: Story = { args: { data: [] } };
