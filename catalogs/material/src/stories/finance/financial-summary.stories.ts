import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { FinancialSummaryComponent } from '../../app/finance/components/financial-summary.component';
import { overviewConfig, pressureConfig } from '../../app/finance/data/finance.fixtures';
const meta: Meta<FinancialSummaryComponent> = {
  title: 'Finance/Components/Financial Summary',
  component: FinancialSummaryComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="max-width:420px">${story}</div>`)],
  parameters: {
    controls: { include: ['data', 'currency', 'locale'] },
    docs: {
      description: {
        component:
          'Reusable composition of FinancePanel and MetricCard. Computes net profit and margin from supplied revenue and expenses; the optional expense budget includes a native accessible meter and explicit over-budget text.',
      },
    },
  },
  args: { data: overviewConfig.periods[0].summary, currency: 'USD', locale: 'en-US' },
};
export default meta;
type Story = StoryObj<FinancialSummaryComponent>;
export const WithinBudget: Story = {};
export const OverBudget: Story = { args: { data: pressureConfig.periods[0].summary } };
export const Empty: Story = { args: { data: undefined } };
export const ZeroRevenue: Story = {
  args: { data: { revenue: 0, expenses: 20000, expenseBudget: 15000 } },
};
