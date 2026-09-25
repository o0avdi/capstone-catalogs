import type { Meta, StoryObj } from '@storybook/angular';
import { TransactionTableComponent } from '../../app/finance/components/transaction-table.component';
import { overviewConfig } from '../../app/finance/data/finance.fixtures';
const meta: Meta<TransactionTableComponent> = {
  title: 'Finance/Components/Transaction Table',
  component: TransactionTableComponent,
  tags: ['autodocs'],
  parameters: {
    controls: { include: ['transactions', 'currency', 'locale'] },
    docs: {
      description: {
        component:
          'Team-owned semantic HTML table with client-side search, status filtering and column sorting. Amounts use the shared formatter. Inputs are never mutated. Keyboard users can sort columns and scroll the table on narrow screens.',
      },
    },
  },
  args: { transactions: overviewConfig.periods[0].transactions, currency: 'USD', locale: 'en-US' },
  argTypes: {
    transactions: { control: 'object' },
    currency: { control: 'text' },
    locale: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<TransactionTableComponent>;
export const RecentActivity: Story = {};
export const Empty: Story = { args: { transactions: [] } };
export const LongDescription: Story = {
  args: {
    transactions: [
      {
        id: 'long',
        date: '2026-06-30',
        description:
          'Annual enterprise subscription settlement for multiple subsidiaries across the North American and European operating regions, including prorated service adjustments',
        category: 'Enterprise',
        amount: 123456789.99,
        status: 'completed',
      },
    ],
  },
};
