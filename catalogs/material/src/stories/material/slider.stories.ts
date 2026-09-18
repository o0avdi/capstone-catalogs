import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatSliderModule } from '@angular/material/slider';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type SliderVariant = 'standard' | 'centered' | 'range';

type SliderArgs = {
  variant: SliderVariant;
  min: number;
  max: number;
  step: number;
  value: number;
  startValue: number;
  endValue: number;
  discrete: boolean;
  showTickMarks: boolean;
  disabled: boolean;
  onValueChange: (value: number | [number, number]) => void;
};

const meta: Meta<SliderArgs> = {
  title: 'Material/Slider',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatSliderModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['standard', 'centered', 'range'],
      description: 'Standard, zero-centered, or two-value range behavior.',
    },
    min: {
      control: 'number',
      description: 'Lowest available value.',
    },
    max: {
      control: 'number',
      description: 'Highest available value.',
    },
    step: {
      control: { type: 'number', min: 1 },
      description: 'Amount added or removed with each slider step.',
    },
    value: {
      control: 'number',
      description: 'Current value for standard and centered sliders.',
    },
    startValue: {
      control: 'number',
      description: 'Beginning value for the range slider.',
    },
    endValue: {
      control: 'number',
      description: 'Ending value for the range slider.',
    },
    discrete: {
      control: 'boolean',
      description: 'Displays the current value while the thumb is active.',
    },
    showTickMarks: {
      control: 'boolean',
      description: 'Displays marks for each available step.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the slider value from being changed.',
    },
    onValueChange: {
      control: false,
      description: 'Story callback fired immediately when a value changes.',
    },
  },
  args: {
    variant: 'standard',
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    startValue: 25,
    endValue: 75,
    discrete: true,
    showTickMarks: false,
    disabled: false,
    onValueChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SliderArgs>();

    const singleValueTemplate = `
      <mat-slider
        [min]="min"
        [max]="max"
        [step]="step"
        [discrete]="discrete"
        [showTickMarks]="showTickMarks"
        [disabled]="disabled"
        style="width: 100%;"
      >
        <input
          matSliderThumb
          [value]="value"
          (valueChange)="handleValueChange($event)"
          [attr.aria-label]="variant === 'centered' ? 'Centered value' : 'Value'"
        />
      </mat-slider>
      <p style="margin: 8px 8px 0;">Current value: {{ value }}</p>
    `;

    const rangeTemplate = `
      <mat-slider
        [min]="min"
        [max]="max"
        [step]="step"
        [discrete]="discrete"
        [showTickMarks]="showTickMarks"
        [disabled]="disabled"
        style="width: 100%;"
      >
        <input
          matSliderStartThumb
          [value]="startValue"
          (valueChange)="handleStartValueChange($event)"
          aria-label="Minimum selected value"
        />
        <input
          matSliderEndThumb
          [value]="endValue"
          (valueChange)="handleEndValueChange($event)"
          aria-label="Maximum selected value"
        />
      </mat-slider>
      <p style="margin: 8px 8px 0;">
        Selected range: {{ startValue }}–{{ endValue }}
      </p>
    `;

    return {
      props: {
        ...args,
        handleValueChange: (value: number) => {
          args.onValueChange(value);
          updateArgs({ value });
        },
        handleStartValueChange: (startValue: number) => {
          args.onValueChange([startValue, args.endValue]);
          updateArgs({ startValue });
        },
        handleEndValueChange: (endValue: number) => {
          args.onValueChange([args.startValue, endValue]);
          updateArgs({ endValue });
        },
      },
      template: `
        <div style="max-width: 720px; padding: 32px 16px;">
          <div style="display: flex; justify-content: space-between; margin: 0 8px 4px;">
            <span>{{ min }}</span>
            <strong>
              {{ variant === 'standard' ? 'Standard slider' :
                 variant === 'centered' ? 'Centered slider' : 'Range slider' }}
            </strong>
            <span>{{ max }}</span>
          </div>

          ${args.variant === 'range' ? rangeTemplate : singleValueTemplate}

          <p *ngIf="variant === 'centered'" style="margin: 8px; color: #5f6368;">
            The scale is centered on zero and supports negative and positive values.
          </p>
        </div>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<SliderArgs>;

export const StandardSlider: Story = {};

export const CenteredSlider: Story = {
  args: {
    variant: 'centered',
    min: -100,
    max: 100,
    value: 25,
  },
};

export const RangeSlider: Story = {
  args: {
    variant: 'range',
    startValue: 25,
    endValue: 75,
  },
};

export const WithTickMarks: Story = {
  args: {
    min: 0,
    max: 10,
    step: 1,
    value: 6,
    showTickMarks: true,
  },
};

export const Disabled: Story = {
  args: {
    value: 60,
    disabled: true,
  },
};
