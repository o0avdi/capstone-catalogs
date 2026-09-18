import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { fn } from 'storybook/test';

@Component({ selector: 'app-chips-demo', standalone: true, imports: [MatChipsModule, MatIconModule], template: `<mat-chip-set aria-label="Selected topics">@for (chip of chips; track chip) { <mat-chip [removable]="removable" (removed)="remove(chip)">{{ chip }} @if (removable) { <button matChipRemove aria-label="Remove {{ chip }}"><mat-icon>cancel</mat-icon></button> }</mat-chip> }</mat-chip-set>` })
class ChipsDemoComponent {
  @Input() chips = ['Design', 'Engineering', 'Research']; @Input() removable = true;
  @Output() chipRemoved = new EventEmitter<string>();
  remove(chip: string): void { this.chips = this.chips.filter((item) => item !== chip); this.chipRemoved.emit(chip); }
}
const meta = { title: 'Material/Chips', component: ChipsDemoComponent, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { chips: ['Design', 'Engineering', 'Research'], removable: true, chipRemoved: fn() }, argTypes: { chips: { control: 'object' }, removable: { control: 'boolean' }, chipRemoved: { control: false } } } satisfies Meta<ChipsDemoComponent>;
export default meta; type Story = StoryObj<ChipsDemoComponent>;
export const Removable: Story = {}; export const ReadOnly: Story = { args: { removable: false } }; export const LongLabels: Story = { args: { chips: ['Quarterly planning', 'Customer experience research', 'Accessibility review'] } };
