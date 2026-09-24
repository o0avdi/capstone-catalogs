import type { Meta, StoryObj } from '@storybook/angular';
import { PriceTrendChartComponent } from '../../app/finance/components/price-trend-chart.component';
import { TimeSeriesPoint } from '../../app/finance/finance.types';
interface Args {
  data: TimeSeriesPoint[];
  title: string;
}
const basic: TimeSeriesPoint[] = [
  { date: '2026-01-01', value: 100 },
  { date: '2026-02-01', value: 104 },
  { date: '2026-03-01', value: 102 },
  { date: '2026-04-01', value: 109 },
  { date: '2026-05-01', value: 112 },
];
const meta: Meta<Args> = {
  title: 'Finance/Price Trend',
  component: PriceTrendChartComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { data: basic, title: 'Portfolio value' },
};
export default meta;
type Story = StoryObj<Args>;
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
