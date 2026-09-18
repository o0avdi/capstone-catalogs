import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { fn } from 'storybook/test';

type ProgressBarArgs = {
  mode: ProgressBarMode;
  value: number;
  bufferValue: number;
  color: 'primary' | 'accent' | 'warn';
  ariaLabel: string;
  showLabel: boolean;
  onAnimationEnd: (event: unknown) => void;
};

const meta: Meta<ProgressBarArgs> = {
  title: 'Material/Progress Bar',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatProgressBarModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
      description: 'How the progress bar communicates the process state.',
    },
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Completion percentage for determinate and buffer modes.',
    },
    bufferValue: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Buffered percentage shown ahead of progress in buffer mode.',
    },
    color: {
      control: 'select',
      options: ['primary', 'accent', 'warn'],
      description: 'Theme palette used by the active indicator.',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible description of the process.',
    },
    showLabel: {
      control: 'boolean',
      description: 'Shows supporting status text above the bar.',
    },
    onAnimationEnd: {
      control: false,
      description: 'Called when a primary progress animation finishes.',
    },
  },
  args: {
    mode: 'determinate',
    value: 65,
    bufferValue: 80,
    color: 'primary',
    ariaLabel: 'Uploading files',
    showLabel: true,
    onAnimationEnd: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: min(560px, 100%);">
        <div
          *ngIf="showLabel"
          style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 10px;"
        >
          <span>{{ ariaLabel }}</span>
          <span *ngIf="mode === 'determinate' || mode === 'buffer'">
            {{ value }}%
          </span>
        </div>

        <mat-progress-bar
          [mode]="mode"
          [value]="value"
          [bufferValue]="bufferValue"
          [color]="color"
          [attr.aria-label]="ariaLabel"
          (animationEnd)="onAnimationEnd($event)"
        />
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<ProgressBarArgs>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  args: {
    mode: 'indeterminate',
    ariaLabel: 'Loading results',
    showLabel: false,
  },
};

export const Buffer: Story = {
  args: {
    mode: 'buffer',
    value: 45,
    bufferValue: 72,
    ariaLabel: 'Streaming video',
  },
};

export const Query: Story = {
  args: {
    mode: 'query',
    ariaLabel: 'Preparing download',
    showLabel: true,
  },
};

export const ErrorState: Story = {
  args: {
    mode: 'determinate',
    value: 78,
    color: 'warn',
    ariaLabel: 'Upload interrupted',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 30,
    ariaLabel: 'Saving changes',
    showLabel: false,
  },
};
