import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

type TimepickerArgs = {
  label: string;
  time: string;
  interval: string;
  minTime: string;
  maxTime: string;
  disabled: boolean;
  showHint: boolean;
};

const timeToDate = (time: string): Date | null => {
  if (!time) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const value = new Date();
  value.setHours(hours, minutes, 0, 0);
  return value;
};

const meta: Meta<TimepickerArgs> = {
  title: 'Material/Timepicker',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatFormFieldModule, MatInputModule, MatTimepickerModule],
      providers: [provideNativeDateAdapter()],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the time input.',
    },
    time: {
      control: 'text',
      description: 'Initial time in 24-hour HH:mm format.',
    },
    interval: {
      control: 'select',
      options: ['5m', '15m', '30m', '1h'],
      description: 'Space between selectable time options.',
    },
    minTime: {
      control: 'text',
      description: 'Earliest selectable time in 24-hour HH:mm format.',
    },
    maxTime: {
      control: 'text',
      description: 'Latest selectable time in 24-hour HH:mm format.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents typing and opening the timepicker.',
    },
    showHint: {
      control: 'boolean',
      description: 'Shows supporting text below the input.',
    },
  },
  args: {
    label: 'Select time',
    time: '07:00',
    interval: '30m',
    minTime: '',
    maxTime: '',
    disabled: false,
    showHint: true,
  },
  render: (args) => ({
    props: {
      ...args,
      timeValue: timeToDate(args.time),
      minValue: timeToDate(args.minTime),
      maxValue: timeToDate(args.maxTime),
    },
    template: `
      <div style="width: 100%; max-width: 360px; padding: 8px;">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>{{ label }}</mat-label>

          <input
            matInput
            [matTimepicker]="picker"
            [value]="timeValue"
            [matTimepickerMin]="minValue"
            [matTimepickerMax]="maxValue"
            [disabled]="disabled"
          />

          <mat-timepicker-toggle
            matIconSuffix
            [for]="picker"
            aria-label="Open time options"
          />

          <mat-timepicker
            #picker
            [interval]="interval"
            aria-label="Available times"
          />

          <mat-hint *ngIf="showHint">
            Type a time or use the clock button to select one.
          </mat-hint>
        </mat-form-field>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<TimepickerArgs>;

// Standard time input with the Material time-options overlay.
export const Default: Story = {};

export const Empty: Story = {
  args: {
    time: '',
    showHint: false,
  },
};

export const AfternoonTime: Story = {
  args: {
    time: '15:30',
    label: 'Appointment time',
  },
};

//5 min interval
export const FineIntervals: Story = {
  args: {
    time: '09:15',
    interval: '5m',
    label: 'Meeting time',
  },
};

export const BusinessHours: Story = {
  args: {
    time: '09:00',
    interval: '30m',
    minTime: '08:00',
    maxTime: '17:00',
    label: 'Office hours',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Scheduled time',
    showHint: false,
  },
};