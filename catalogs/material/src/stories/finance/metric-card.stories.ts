import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { MetricCardComponent } from '../../app/finance/components/metric-card.component';
const meta: Meta<MetricCardComponent> = {
  title: 'Finance/Components/Metric Card',
  component: MetricCardComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="max-width:380px">${story}</div>`)],
  parameters: {
    controls: {
      include: [
        'label',
        'value',
        'format',
        'currency',
        'locale',
        'subtitle',
        'change',
        'changeFormat',
        'helper',
        'icon',
        'state',
      ],
    },
    layout: 'padded',
    docs: {
      description: {
        component:
          'Custom financial KPI composition using Angular Material MatCard. Numeric formatting uses Intl.NumberFormat; percent inputs are ratios. State means favorable/unfavorable, independent of whether the change is positive or negative. Legacy preformatted strings remain supported.',
      },
    },
  },
  args: {
    label: 'Total revenue',
    value: 1340000,
    format: 'currency',
    currency: 'USD',
    locale: 'en-US',
    change: 0.1453,
    changeFormat: 'percent',
    helper: 'vs. previous quarter',
    state: 'positive',
    icon: '$',
  },
  argTypes: {
    value: { control: 'number' },
    change: { control: 'number' },
    format: { control: 'select', options: ['currency', 'percent', 'number', 'compact'] },
    changeFormat: { control: 'select', options: ['currency', 'percent', 'number', 'compact'] },
    state: { control: 'inline-radio', options: ['positive', 'negative', 'neutral'] },
    currency: { control: 'text' },
    locale: { control: 'text' },
    icon: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<MetricCardComponent>;
export const Revenue: Story = {};
export const OperatingProfit: Story = {
  args: { label: 'Net profit', value: 425000, change: 0.3666, icon: '↗' },
};
export const ExpenseIncrease: Story = {
  args: { label: 'Expenses', value: 1130000, change: 0.235, state: 'negative', icon: '↘' },
};
export const Margin: Story = {
  args: { label: 'Profit margin', value: 0.317, format: 'percent', change: '+5.1 pp', icon: '%' },
};
export const AbsoluteChange: Story = {
  args: { label: 'Cash flow', value: 286000, change: 32000, changeFormat: 'currency' },
};
export const Neutral: Story = {
  args: {
    label: 'Customer acquisition cost',
    value: 240,
    change: 0,
    state: 'neutral',
    icon: undefined,
  },
};
export const LargeValue: Story = {
  args: {
    label: 'Assets under management',
    value: 123456789012,
    format: 'compact',
    subtitle: 'USD · compact notation',
    change: undefined,
  },
};
export const EuroFormatting: Story = {
  args: { currency: 'EUR', locale: 'de-DE', value: 1234567.89 },
};
