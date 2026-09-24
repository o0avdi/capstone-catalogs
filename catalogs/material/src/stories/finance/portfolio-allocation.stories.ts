import type { Meta, StoryObj } from '@storybook/angular';
import { PortfolioAllocationChartComponent } from '../../app/finance/components/portfolio-allocation-chart.component';
import { AllocationPoint } from '../../app/finance/finance.types';
interface Args {
  data: AllocationPoint[];
}
const meta: Meta<Args> = {
  title: 'Finance/Portfolio Allocation',
  component: PortfolioAllocationChartComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    data: [
      { category: 'Equities', value: 48 },
      { category: 'Bonds', value: 27 },
      { category: 'Alternatives', value: 15 },
      { category: 'Cash', value: 10 },
    ],
  },
};
export default meta;
type Story = StoryObj<Args>;
export const BalancedPortfolio: Story = {};
export const ConcentratedPortfolio: Story = {
  args: {
    data: [
      { category: 'US equities', value: 72 },
      { category: 'International equities', value: 15 },
      { category: 'Bonds', value: 8 },
      { category: 'Cash', value: 5 },
    ],
  },
};
