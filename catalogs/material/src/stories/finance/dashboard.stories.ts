import type { Meta, StoryObj } from '@storybook/angular';
import { FinanceDashboardComponent } from '../../app/finance/components/finance-dashboard.component';
import {
  overviewConfig,
  growthConfig,
  pressureConfig,
  emptyConfig,
  emptyPeriodConfig,
} from '../../app/finance/data/finance.fixtures';

const meta: Meta<FinanceDashboardComponent> = {
  title: 'Finance/Templates/Executive Dashboard',
  component: FinanceDashboardComponent,
  tags: ['autodocs'],
  parameters: {
    controls: { include: ['config', 'initialPeriodId', 'loading', 'error'] },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A team-owned Angular template composed from MetricCard, PriceTrendChart, TransactionTable and FinancialSummary. All values come from typed configuration. Choose a reporting period to update every panel. Data is illustrative, not a live financial feed.',
      },
    },
  },
  args: { config: overviewConfig, initialPeriodId: 'q2', loading: false, error: '' },
  argTypes: {
    config: { control: 'object' },
    initialPeriodId: { control: 'text' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
    periodChange: { action: 'periodChange' },
  },
};
export default meta;
type Story = StoryObj<FinanceDashboardComponent>;
export const DefaultFinancialOverview: Story = {};
export const StrongGrowthScenario: Story = {
  args: { config: growthConfig, initialPeriodId: 'growth' },
};
export const ExpensePressureScenario: Story = {
  args: { config: pressureConfig, initialPeriodId: 'pressure' },
};
export const EmptyState: Story = { args: { config: emptyConfig } };
export const EmptyReportingPeriod: Story = { args: { config: emptyPeriodConfig } };
export const LoadingState: Story = { args: { loading: true } };
export const ErrorState: Story = {
  args: { error: 'The reporting dataset is unavailable. Check the data source and try again.' },
};
