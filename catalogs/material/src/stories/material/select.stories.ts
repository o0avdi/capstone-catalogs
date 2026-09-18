import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type SelectValue = string | string[];

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectArgs = {
  label: string;
  placeholder: string;
  selectedValue: SelectValue;
  multiple: boolean;
  disabled: boolean;
  required: boolean;
  options: SelectOption[];
  onSelectionChange: (value: SelectValue) => void;
};

const destinationOptions: SelectOption[] = [
  { value: 'charleston', label: 'Charleston' },
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'rome', label: 'Rome' },
  { value: 'zurich', label: 'Zurich' },
];

const meta: Meta<SelectArgs> = {
  title: 'Material/Select',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatFormFieldModule, MatSelectModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Form-field label describing the available choices.',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt displayed before a value is selected.',
    },
    selectedValue: {
      control: 'object',
      description: 'Currently selected value or values.',
    },
    multiple: {
      control: false,
      description: 'Whether more than one option can be selected.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select prevents user interaction.',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field requires a selection.',
    },
    options: {
      control: 'object',
      description: 'Options displayed in the select panel.',
    },
    onSelectionChange: {
      control: false,
      description: 'Story callback receiving the newly selected value.',
    },
  },
  args: {
    label: 'Destination',
    placeholder: 'Choose a destination',
    selectedValue: '',
    multiple: false,
    disabled: false,
    required: false,
    options: destinationOptions,
    onSelectionChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SelectArgs>();

    return {
      props: {
        ...args,
        handleSelectionChange: (selectedValue: SelectValue) => {
          args.onSelectionChange(selectedValue);
          updateArgs({ selectedValue });
        },
      },
      template: `
        <mat-form-field appearance="outline" style="width: 320px; max-width: 100%;">
          <mat-label>{{ label }}</mat-label>
          <mat-select
            [value]="selectedValue"
            [multiple]="multiple"
            [disabled]="disabled"
            [required]="required"
            [placeholder]="placeholder"
            (selectionChange)="handleSelectionChange($event.value)"
          >
            <mat-option
              *ngFor="let option of options"
              [value]="option.value"
              [disabled]="option.disabled"
            >
              {{ option.label }}
            </mat-option>
          </mat-select>
          <mat-hint>Select from the available options</mat-hint>
        </mat-form-field>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<SelectArgs>;

export const Basic: Story = {};

export const Preselected: Story = {
  args: {
    selectedValue: 'london',
  },
};

export const MultipleSelection: Story = {
  args: {
    label: 'Destinations',
    placeholder: 'Choose destinations',
    selectedValue: ['london', 'paris'],
    multiple: true,
  },
};

export const Disabled: Story = {
  args: {
    selectedValue: 'charleston',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const DisabledOption: Story = {
  args: {
    options: [
      ...destinationOptions.slice(0, 3),
      { value: 'rome', label: 'Rome — currently unavailable', disabled: true },
      destinationOptions[4],
    ],
  },
};

export const LongOptionLabels: Story = {
  args: {
    label: 'Travel package',
    placeholder: 'Choose a package',
    options: [
      { value: 'city', label: 'Three-night city break with guided walking tour' },
      { value: 'coast', label: 'Seven-night coastal escape with breakfast included' },
      { value: 'rail', label: 'Multi-city rail journey with flexible departure dates' },
    ],
  },
};
