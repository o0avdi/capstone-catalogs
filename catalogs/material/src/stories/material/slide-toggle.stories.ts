import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type LabelPosition = 'before' | 'after';

type SlideToggleArgs = {
  label: string;
  checked: boolean;
  disabled: boolean;
  labelPosition: LabelPosition;
  disableRipple: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const meta: Meta<SlideToggleArgs> = {
  title: 'Material/Slide Toggle',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatSlideToggleModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text describing the setting controlled by the toggle.',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the setting is currently turned on.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether user interaction is disabled.',
    },
    labelPosition: {
      control: 'radio',
      options: ['before', 'after'],
      description: 'Places the label before or after the toggle.',
    },
    disableRipple: {
      control: 'boolean',
      description: 'Removes the Material interaction ripple.',
    },
    onCheckedChange: {
      control: false,
      description: 'Story callback receiving the new checked value.',
    },
  },
  args: {
    label: 'Enable notifications',
    checked: false,
    disabled: false,
    labelPosition: 'after',
    disableRipple: false,
    onCheckedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SlideToggleArgs>();

    return {
      props: {
        ...args,
        handleChange: (checked: boolean) => {
          args.onCheckedChange(checked);
          updateArgs({ checked });
        },
      },
      template: `
        <mat-slide-toggle
          [checked]="checked"
          [disabled]="disabled"
          [labelPosition]="labelPosition"
          [disableRipple]="disableRipple"
          (change)="handleChange($event.checked)"
        >
          {{ label }}
        </mat-slide-toggle>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<SlideToggleArgs>;

export const Off: Story = {};

export const On: Story = {
  args: {
    checked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const LabelBefore: Story = {
  args: {
    checked: true,
    labelPosition: 'before',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Automatically download updates when connected to Wi-Fi',
  },
};
