import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import type {
  TooltipPosition,
  TooltipTouchGestures,
} from '@angular/material/tooltip';

type TooltipArgs = {
  label: string;
  message: string;
  position: TooltipPosition;
  disabled: boolean;
  showDelay: number;
  hideDelay: number;
  touchGestures: TooltipTouchGestures;
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
    touchGestures: {
      control: 'radio',
      options: ['auto', 'on', 'off'],
      description: 'Controls how touch gestures activate the tooltip.',
    },
  },
  args: {
    label: 'Export report',
    message: 'Download this report as a CSV file',
    position: 'below',
    disabled: false,
    showDelay: 0,
    hideDelay: 0,
    touchGestures: 'auto',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="padding: 96px;">
        <button
          type="button"
          matButton="outlined"
          [matTooltip]="message"
          [matTooltipPosition]="position"
          [matTooltipDisabled]="disabled"
          [matTooltipShowDelay]="showDelay"
          [matTooltipHideDelay]="hideDelay"
          [matTooltipTouchGestures]="touchGestures"
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

export const Left: Story = {
  args: {
    position: 'left',
  },
};

export const Right: Story = {
  args: {
    position: 'right',
  },
};

export const Before: Story = {
  args: {
    position: 'before',
    message: 'Appears before the trigger based on text direction',
  },
};

export const After: Story = {
  args: {
    position: 'after',
    message: 'Appears after the trigger based on text direction',
  },
};

export const Delayed: Story = {
  args: {
    showDelay: 700,
    hideDelay: 300,
    message: 'This tooltip waits before appearing',
  },
};

export const LongMessage: Story = {
  args: {
    label: 'View requirements',
    message:
      'You need administrator permission before you can change this workspace setting.',
    position: 'above',
  },
};

export const EmptyMessage: Story = {
  args: {
    message: '',
    label: 'No tooltip message',
  },
};

export const TouchEnabled: Story = {
  args: {
    label: 'Press and hold',
    message: 'Touch gestures are enabled for this tooltip',
    touchGestures: 'on',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
