import type { Meta, StoryObj } from '@storybook/angular'; 
import { moduleMetadata } from '@storybook/angular'; 
import { MatIconModule } from '@angular/material/icon';

type IconArgs = { name: string; label: string };
const meta: Meta<IconArgs> = { title: 'Material/Icon', tags: ['autodocs'], decorators: [moduleMetadata({ imports: [MatIconModule] })], parameters: { layout: 'padded' }, args: { name: 'favorite', label: 'Favorite' }, argTypes: { name: { control: 'select', options: ['favorite', 'home', 'search', 'settings', 'delete', 'info'] }, label: { control: 'text' } }, render: (args) => ({ props: args, template: `<mat-icon [attr.aria-label]="label" role="img" style="font-size:36px;width:36px;height:36px">{{ name }}</mat-icon>` }) };
export default meta; 

type Story = StoryObj<IconArgs>; 
export const Basic: Story = {}; 
export const CommonIcons: Story = { render: () => ({ template: `<div style="display:flex;gap:20px;align-items:center"><mat-icon aria-label="Home" role="img">home</mat-icon><mat-icon aria-label="Search" role="img">search</mat-icon><mat-icon aria-label="Settings" role="img">settings</mat-icon><mat-icon aria-label="Notifications" role="img">notifications</mat-icon></div>` }) };
