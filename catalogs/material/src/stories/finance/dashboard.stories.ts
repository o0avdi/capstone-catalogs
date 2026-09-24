import type { Meta, StoryObj } from '@storybook/angular';
import { FinanceDashboardComponent } from '../../app/finance/components/finance-dashboard.component';
const meta: Meta<FinanceDashboardComponent> = {
  title: 'Finance/Dashboard',
  component: FinanceDashboardComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<FinanceDashboardComponent>;
export const ExecutiveOverview: Story = {};
