import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatRadioModule } from '@angular/material/radio';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type RadioLayout = 'vertical' | 'horizontal';

type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioArgs = {
  groupLabel: string;
  selectedValue: string;
  disabled: boolean;
  layout: RadioLayout;
  options: RadioOption[];
  onSelectionChange: (value: string) => void;
};

const deliveryOptions: RadioOption[] = [
  { value: 'standard', label: 'Standard delivery' },
  { value: 'express', label: 'Express delivery' },
  { value: 'pickup', label: 'Store pickup' },
];

const meta: Meta<RadioArgs> = {
  title: 'Material/Radio',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatRadioModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    groupLabel: {
      control: 'text',
      description: 'Accessible label describing the choice being made.',
    },
    selectedValue: {
      control: 'text',
      description: 'Value of the single selected option.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire radio group is disabled.',
    },
    layout: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Arrangement of the radio options.',
    },
    options: {
      control: 'object',
      description: 'Mutually exclusive choices shown in the group.',
    },
    onSelectionChange: {
      control: false,
      description: 'Story callback receiving the selected value.',
    },
  },
  args: {
    groupLabel: 'Delivery method',
    selectedValue: 'standard',
    disabled: false,
    layout: 'vertical',
    options: deliveryOptions,
    onSelectionChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<RadioArgs>();

    return {
      props: {
        ...args,
        handleSelectionChange: (selectedValue: string) => {
          args.onSelectionChange(selectedValue);
          updateArgs({ selectedValue });
        },
      },
      template: `
        <fieldset style="margin: 0; padding: 0; border: 0;">
          <legend style="margin-bottom: 12px; font-weight: 500;">
            {{ groupLabel }}
          </legend>

          <mat-radio-group
            [value]="selectedValue"
            [disabled]="disabled"
            [attr.aria-label]="groupLabel"
            (change)="handleSelectionChange($event.value)"
            style="display: flex; gap: 8px 20px;"
            [style.flex-direction]="layout === 'vertical' ? 'column' : 'row'"
            [style.flex-wrap]="layout === 'horizontal' ? 'wrap' : 'nowrap'"
          >
            <mat-radio-button
              *ngFor="let option of options"
              [value]="option.value"
              [disabled]="option.disabled"
            >
              {{ option.label }}
            </mat-radio-button>
          </mat-radio-group>
        </fieldset>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<RadioArgs>;

export const Selected: Story = {};

export const NoSelection: Story = {
  args: {
    selectedValue: '',
  },
};

export const Horizontal: Story = {
  args: {
    layout: 'horizontal',
  },
};

export const DisabledGroup: Story = {
  args: {
    selectedValue: 'express',
    disabled: true,
  },
};

export const DisabledOption: Story = {
  args: {
    options: [
      deliveryOptions[0],
      deliveryOptions[1],
      { value: 'pickup', label: 'Store pickup — unavailable', disabled: true },
    ],
  },
};

export const LongLabels: Story = {
  args: {
    groupLabel: 'Preferred contact method',
    selectedValue: 'email',
    options: [
      { value: 'email', label: 'Email me a detailed confirmation and receipt' },
      { value: 'text', label: 'Send a brief confirmation by text message' },
      { value: 'none', label: 'Do not send an additional confirmation' },
    ],
  },
};
