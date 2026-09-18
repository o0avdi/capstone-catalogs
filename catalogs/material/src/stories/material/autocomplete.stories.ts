import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type AutocompleteArgs = {
  label: string;
  placeholder: string;
  value: string;
  disabled: boolean;
  options: string[];
  onSelected: (value: string) => void;
};

const meta: Meta<AutocompleteArgs> = {
  title: 'Material/Autocomplete',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text placed inside the form-field label.',
    },
    placeholder: {
      control: 'text',
      description: 'Native input placeholder.',
    },
    value: {
      control: 'text',
      description: 'Current input text, also used to filter suggestions.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input.',
    },
    options: {
      control: 'object',
      description: 'Story data used to create suggestion options.',
    },
    onSelected: {
      control: false,
      description: 'Story callback receiving the selected option text.',
    },
  },
  args: {
    label: 'Destination',
    placeholder: 'Start typing a city',
    value: '',
    disabled: false,
    options: ['Louisville', 'London', 'Paris', 'Rome', 'Sarajevo'],
    onSelected: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<AutocompleteArgs>();

    const filteredOptions = args.options.filter((option) =>
      option.toLowerCase().includes(args.value.toLowerCase()),
    );

    return {
      props: {
        ...args,
        filteredOptions,
        handleInput: (value: string) => {
          updateArgs({ value });
        },
        handleSelected: (value: string) => {
          args.onSelected(value);
          updateArgs({ value });
        },
      },
      template: `
        <mat-form-field
          appearance="outline"
          style="width: 360px; max-width: 100%;"
        >
          <mat-label>{{ label }}</mat-label>

          <input
            #textInput
            matInput
            type="text"
            [value]="value"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [matAutocomplete]="auto"
            (input)="handleInput(textInput.value)"
          />

          <mat-autocomplete
            #auto="matAutocomplete"
            (optionSelected)="handleSelected($event.option.value)"
          >
            @for (option of filteredOptions; track $index) {
              <mat-option [value]="option">{{ option }}</mat-option>
            } @empty {
              <mat-option disabled>No matching destinations</mat-option>
            }
          </mat-autocomplete>

          <mat-hint>Type to filter, then choose a suggestion</mat-hint>
        </mat-form-field>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<AutocompleteArgs>;

export const Basic: Story = {};

export const Prefilled: Story = {
  args: {
    value: 'Lo',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Louisville',
    disabled: true,
  },
};

export const NoMatches: Story = {
  args: {
    value: 'Atlantis',
  },
};

export const LongOptions: Story = {
  args: {
    options: [
      'Louisville — Kentucky, United States',
      'London — England, United Kingdom',
      'Sarajevo — Bosnia and Herzegovina',
    ],
  },
};