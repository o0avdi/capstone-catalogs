import type { Meta, StoryObj } from '@storybook/angular'; import { moduleMetadata } from '@storybook/angular'; import { MatDividerModule } from '@angular/material/divider';
const meta = { title: 'Material/Divider', tags: ['autodocs'], decorators: [moduleMetadata({ imports: [MatDividerModule] })], parameters: { layout: 'padded' } } satisfies Meta;
export default meta; type Story = StoryObj;
export const Horizontal: Story = { render: () => ({ template: `<section style="max-width: 440px"><p>Account activity</p><mat-divider></mat-divider><p>Recent transactions appear here.</p></section>` }) };
export const Vertical: Story = { render: () => ({ template: `<div style="display:flex; align-items:center; gap:16px; height:64px"><span>Overview</span><mat-divider vertical></mat-divider><span>Details</span><mat-divider vertical></mat-divider><span>Settings</span></div>` }) };
