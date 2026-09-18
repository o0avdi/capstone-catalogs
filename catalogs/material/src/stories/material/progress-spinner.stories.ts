import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MatProgressSpinnerModule,
  ProgressSpinnerMode,
} from '@angular/material/progress-spinner';

type ProgressIndicator = 'circular' | 'linear';

type ProgressSpinnerArgs = {
  indicator: ProgressIndicator;
  mode: ProgressSpinnerMode;
  value: number;
  diameter: number;
  strokeWidth: number;
  color: 'primary' | 'accent' | 'warn';
  ariaLabel: string;
  showLabel: boolean;
};

const meta: Meta<ProgressSpinnerArgs> = {
  title: 'Material/Progress Spinner',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatProgressSpinnerModule, MatProgressBarModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    indicator: {
      control: 'radio',
      options: ['circular', 'linear'],
      description: 'The circular spinner or linear progress-bar variant.',
    },
    mode: {
      control: 'radio',
      options: ['indeterminate', 'determinate'],
      description: 'Use indeterminate when progress cannot be measured.',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Completion percentage used in determinate mode.',
    },
    diameter: {
      control: { type: 'range', min: 16, max: 120, step: 4 },
      description: 'Circular spinner diameter in pixels.',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 12, step: 1 },
      description: 'Circular spinner stroke width in pixels.',
    },
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible description of the process in progress.',
    },
    showLabel: {
      control: 'boolean',
      description: 'Shows supporting status text beside the indicator.',
    },
  },
  args: {
    indicator: 'circular',
    mode: 'indeterminate',
    value: 65,
    diameter: 48,
    strokeWidth: 4,
    color: 'primary',
    ariaLabel: 'Loading content',
    showLabel: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <div
        style="display: flex; align-items: center; gap: 16px; min-width: 280px;"
        [style.flex-direction]="indicator === 'linear' ? 'column' : 'row'"
        [style.align-items]="indicator === 'linear' ? 'stretch' : 'center'"
      >
        <mat-progress-spinner
          *ngIf="indicator === 'circular'"
          [mode]="mode"
          [value]="value"
          [diameter]="diameter"
          [strokeWidth]="strokeWidth"
          [color]="color"
          [attr.aria-label]="ariaLabel"
        />

        <mat-progress-bar
          *ngIf="indicator === 'linear'"
          [mode]="mode"
          [value]="value"
          [color]="color"
          [attr.aria-label]="ariaLabel"
        />

        <span *ngIf="showLabel">
          {{ ariaLabel }}{{ mode === 'determinate' ? ' — ' + value + '%' : '…' }}
        </span>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<ProgressSpinnerArgs>;

//keep circling
export const CircularIndeterminate: Story = {};

//show percent done
export const CircularDeterminate: Story = {
  args: {
    mode: 'determinate',
    value: 65,
    ariaLabel: 'Uploading files',
    showLabel: true,
  },
};

export const LinearIndeterminate: Story = {
  args: {
    indicator: 'linear',
    ariaLabel: 'Loading results',
  },
};

export const LinearDeterminate: Story = {
  args: {
    indicator: 'linear',
    mode: 'determinate',
    value: 40,
    ariaLabel: 'Processing order',
    showLabel: true,
  },
};

export const SmallCircular: Story = {
  args: {
    diameter: 24,
    strokeWidth: 3,
    ariaLabel: 'Loading item',
  },
};

export const LargeCircular: Story = {
  args: {
    diameter: 96,
    strokeWidth: 8,
    ariaLabel: 'Loading dashboard',
  },
};

export const ErrorColor: Story = {
  args: {
    mode: 'determinate',
    value: 75,
    color: 'warn',
    ariaLabel: 'Retrying upload',
    showLabel: true,
  },
};
