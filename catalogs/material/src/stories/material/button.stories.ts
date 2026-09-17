import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';

type ButtonArgs = {
  label: string;
  disabled: boolean;
  appearance: 'text' | 'filled' | 'elevated' | 'outlined' | 'tonal';
};

const meta: Meta<ButtonArgs> = {
  title: 'Material/Button',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatButtonModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Story text projected inside the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled.',
    },
    appearance: {
      control: 'select',
      options: ['text', 'filled', 'elevated', 'outlined', 'tonal'],
      description: 'Visual style passed to the matButton input.',
    },
  },
  args: {
    label: 'Save changes',
    disabled: false,
    appearance: 'filled',
  },
  render: (args) => ({
    props: args,
    template: `
      <button
        type="button"
        [matButton]="appearance"
        [disabled]="disabled"
      >
        {{ label }}
      </button>
    `,
  }),
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Filled: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Outlined: Story = {
  args: {
    appearance: 'outlined',
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Save all changes and return to the dashboard',
  },
};