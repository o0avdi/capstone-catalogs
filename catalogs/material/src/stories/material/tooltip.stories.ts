import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import type { TooltipPosition } from '@angular/material/tooltip';

type TooltipArgs = {
  label: string;
  message: string;
  position: TooltipPosition;
  disabled: boolean;
  showDelay: number;
  hideDelay: number;
};

const meta: Meta<TooltipArgs> = {
  title: 'Material/Tooltip',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule, MatTooltipModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text inside the button that triggers the tooltip.',
    },
    message: {
      control: 'text',
      description: 'Tooltip text passed to matTooltip.',
    },
    position: {
      control: 'select',
      options: ['above', 'below', 'left', 'right', 'before', 'after'],
      description: 'Preferred tooltip position relative to the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tooltip; the button remains enabled.',
    },
    showDelay: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Delay before showing the tooltip, in milliseconds.',
    },
    hideDelay: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Delay before hiding the tooltip, in milliseconds.',
    },
  },
  args: {
    label: 'Export report',
    message: 'Download this report as a CSV file',
    position: 'below',
    disabled: false,
    showDelay: 0,
    hideDelay: 0,
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 64px;">
        <button
          type="button"
          matButton="outlined"
          [matTooltip]="message"
          [matTooltipPosition]="position"
          [matTooltipDisabled]="disabled"
          [matTooltipShowDelay]="showDelay"
          [matTooltipHideDelay]="hideDelay"
        >
          {{ label }}
        </button>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<TooltipArgs>;

export const Default: Story = {};

export const Above: Story = {
  args: {
    position: 'above',
  },
};

export const Delayed: Story = {
  args: {
    showDelay: 700,
    hideDelay: 300,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};