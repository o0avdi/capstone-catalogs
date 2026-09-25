import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { FinancePanelComponent } from '../../app/finance/shared/finance-panel.component';
const meta: Meta<FinancePanelComponent> = {
  title: 'Finance/Foundations/Panel',
  component: FinancePanelComponent,
  tags: ['autodocs'],
  decorators: [componentWrapperDecorator((story) => `<div style="max-width:720px">${story}</div>`)],
  parameters: {
    docs: {
      description: {
        component:
          'A styled wrapper around @angular/material/card MatCard, with a heading, optional subtitle and projected content. The dashboard and financial summary reuse this surface. Other library primitives are documented under Material in this same Storybook.',
      },
    },
  },
  args: { title: 'Financial panel', subtitle: 'A consistent surface for financial content' },
  render: (args) => ({
    props: args,
    template:
      '<finance-panel [title]="title" [subtitle]="subtitle"><p>Project a chart, table or summary into this reusable Material card surface.</p></finance-panel>',
  }),
};
export default meta;
export const Default: StoryObj<FinancePanelComponent> = {};
