import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type AutocompleteArgs = {
  placeholder: string;
  search: string;
  value: string | null;
  disabled: boolean;
  autoHighlight: boolean;
  emptyMessage: string;
  options: string[];
  onSelected: (value: string | null) => void;
};

const meta: Meta<AutocompleteArgs> = {
  title: 'Spartan/Autocomplete',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [...HlmAutocompleteImports],
    }),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder displayed inside the search input.',
    },

    search: {
      control: 'text',
      description: 'Current search query used to filter the options.',
    },

    value: {
      control: 'text',
      description: 'Currently selected option.',
    },

    disabled: {
      control: 'boolean',
      description: 'Disables the autocomplete.',
    },

    autoHighlight: {
      control: 'boolean',
      description:
        'Automatically highlights the first available result.',
    },

    emptyMessage: {
      control: 'text',
      description: 'Message displayed when no options match the search.',
    },

    options: {
      control: 'object',
      description: 'Options displayed inside the autocomplete dropdown.',
    },

    onSelected: {
      control: false,
      description: 'Called when an option is selected.',
    },
  },

  args: {
    placeholder: 'Search components',
    search: '',
    value: null,
    disabled: false,
    autoHighlight: true,
    emptyMessage: 'No components found.',
    options: [
      'Accordion',
      'Alert',
      'Alert Dialog',
      'Aspect Ratio',
      'Attachment',
      'Autocomplete',
      'Avatar',
      'Badge',
      'Breadcrumb',
      'Button',
      'Calendar',
      'Card',
      'Checkbox',
      'Dialog',
      'Input',
      'Select',
      'Table',
      'Tabs',
      'Tooltip',
    ],
    onSelected: fn(),
  },

  render: function Render(args) {
    const [, updateArgs] = useArgs<AutocompleteArgs>();

    const filteredOptions = args.options.filter((option) =>
      option.toLowerCase().includes(args.search.toLowerCase()),
    );

    return {
      props: {
        ...args,
        filteredOptions,

        handleSearch: (search: string) => {
          updateArgs({ search });
        },

        handleSelected: (
          value: string | null | undefined,
        ) => {
          const selectedValue = value ?? null;

          args.onSelected(selectedValue);

          updateArgs({
            value: selectedValue,
            search: selectedValue ?? '',
          });
        },
      },

      template: `
        <div class="w-80 max-w-full">
          <hlm-autocomplete
            [search]="search"
            [value]="value"
            [disabled]="disabled"
            [autoHighlight]="autoHighlight"
            (searchChange)="handleSearch($event)"
            (valueChange)="handleSelected($event)"
          >
            <hlm-autocomplete-input
              [placeholder]="placeholder"
            />

            <hlm-autocomplete-content
              *hlmAutocompletePortal
            >
              <hlm-autocomplete-empty>
                {{ emptyMessage }}
              </hlm-autocomplete-empty>

              <div hlmAutocompleteList>
                @for (option of filteredOptions; track option) {
                  <hlm-autocomplete-item [value]="option">
                    {{ option }}
                  </hlm-autocomplete-item>
                }
              </div>
            </hlm-autocomplete-content>
          </hlm-autocomplete>
        </div>
      `,
    };
  },
};

export default meta;

type Story = StoryObj<AutocompleteArgs>;

export const Basic: Story = {};

export const Prefilled: Story = {
  args: {
    search: 'Alert',
  },
};

export const Selected: Story = {
  args: {
    search: 'Accordion',
    value: 'Accordion',
  },
};

export const Disabled: Story = {
  args: {
    search: 'Autocomplete',
    value: 'Autocomplete',
    disabled: true,
  },
};

export const NoMatches: Story = {
  args: {
    search: 'Material',
  },
};

export const WithoutAutoHighlight: Story = {
  args: {
    autoHighlight: false,
  },
};

export const Cities: Story = {
  args: {
    placeholder: 'Search cities',
    emptyMessage: 'No cities found.',
    options: [
      'Louisville',
      'London',
      'New York',
      'Paris',
      'Rome',
      'Sarajevo',
      'Tokyo',
    ],
  },
};

export const LongOptions: Story = {
  args: {
    placeholder: 'Search destinations',
    emptyMessage: 'No destinations found.',
    options: [
      'Louisville — Kentucky, United States',
      'London — England, United Kingdom',
      'New York City — New York, United States',
      'Paris — Île-de-France, France',
      'Sarajevo — Bosnia and Herzegovina',
    ],
  },
};