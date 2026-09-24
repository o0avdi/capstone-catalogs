import type { Meta, StoryObj } from '@storybook/angular';
import { PnlChartComponent } from '../../app/finance/components/pnl-chart.component';
import { PnlPoint } from '../../app/finance/finance.types';
interface Args {
  data: PnlPoint[];
}
const normal: PnlPoint[] = [
  { period: 'Jan', revenue: 680000, expenses: 460000 },
  { period: 'Feb', revenue: 720000, expenses: 485000 },
  { period: 'Mar', revenue: 755000, expenses: 500000 },
  { period: 'Apr', revenue: 780000, expenses: 515000 },
];
const meta: Meta<Args> = {
  title: 'Finance/Profit and Loss',
  component: PnlChartComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { data: normal },
};
export default meta;
type Story = StoryObj<Args>;
export const MonthlyPerformance: Story = {};
export const WeakerPeriod: Story = {
  args: {
    data: [
      ...normal.slice(0, 2),
      { period: 'Mar', revenue: 590000, expenses: 540000 },
      { period: 'Apr', revenue: 650000, expenses: 530000 },
    ],
  },
};
