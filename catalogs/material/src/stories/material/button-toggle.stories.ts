import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { fn } from 'storybook/test';

type ButtonToggleArgs = { value: string; disabled: boolean; onSelectionChange: (value: string) => void };

const meta: Meta<ButtonToggleArgs> = {
  title: 'Material/Button Toggle', tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatButtonToggleModule] })], parameters: { layout: 'padded' },
  args: { value: 'week', disabled: false, onSelectionChange: fn() },
  argTypes: { value: { control: 'select', options: ['day', 'week', 'month'] }, disabled: { control: 'boolean' }, onSelectionChange: { control: false } },
  render: (args) => ({ props: args, template: `<mat-button-toggle-group [value]="value" [disabled]="disabled" aria-label="Reporting period" (change)="onSelectionChange($event.value)"><mat-button-toggle value="day">Day</mat-button-toggle><mat-button-toggle value="week">Week</mat-button-toggle><mat-button-toggle value="month">Month</mat-button-toggle></mat-button-toggle-group>` }),
};
export default meta;
type Story = StoryObj<ButtonToggleArgs>;
export const Single: Story = {};
export const Preselected: Story = { args: { value: 'month' } };
export const Disabled: Story = { args: { disabled: true } };
export const Multiple: Story = { render: (args) => ({ props: args, template: `<mat-button-toggle-group multiple [value]="['bold', 'italic']" [disabled]="disabled" aria-label="Text formatting" (change)="onSelectionChange($event.value.join(', '))"><mat-button-toggle value="bold">Bold</mat-button-toggle><mat-button-toggle value="italic">Italic</mat-button-toggle><mat-button-toggle value="underline">Underline</mat-button-toggle></mat-button-toggle-group>` }) };
