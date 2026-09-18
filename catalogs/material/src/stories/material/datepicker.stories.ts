import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type DatepickerArgs = { label: string; value: Date | null; disabled: boolean };
const meta: Meta<DatepickerArgs> = { title: 'Material/Datepicker', tags: ['autodocs'], decorators: [moduleMetadata({ imports: [MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule] })], parameters: { layout: 'padded' }, args: { label: 'Choose a date', value: null, disabled: false }, argTypes: { label: { control: 'text' }, value: { control: false }, disabled: { control: 'boolean' } }, render: (args) => ({ props: args, template: `<mat-form-field appearance="outline" style="width: 280px"><mat-label>{{ label }}</mat-label><input matInput [matDatepicker]="picker" [value]="value" [disabled]="disabled"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field>` }) };
export default meta; type Story = StoryObj<DatepickerArgs>;
export const Basic: Story = {}; export const Preselected: Story = { args: { value: new Date(2026, 8, 18) } }; export const Disabled: Story = { args: { value: new Date(2026, 8, 18), disabled: true } };
