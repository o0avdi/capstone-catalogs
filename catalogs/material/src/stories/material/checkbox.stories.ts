import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type CheckboxArgs = {
  label: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const meta: Meta<CheckboxArgs> = {
  title: 'Material/Checkbox',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatCheckboxModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Story text placed inside the checkbox.',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether user interaction is disabled.',
    },
    onCheckedChange: {
      control: false,
      description: 'Story callback receiving the new checked value.',
    },
  },
  args: {
    label: 'Include archived transactions',
    checked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<CheckboxArgs>();

    return {
      props: {
        ...args,
        handleChange: (checked: boolean) => {
          args.onCheckedChange(checked);
          updateArgs({ checked });
        },
      },
      template: `
        <mat-checkbox
          [checked]="checked"
          [disabled]="disabled"
          (change)="handleChange($event.checked)"
        >
          {{ label }}
        </mat-checkbox>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<CheckboxArgs>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const LongLabel: Story = {
  args: {
    label:
      'Include archived transactions from all previous reporting periods',
  },
};