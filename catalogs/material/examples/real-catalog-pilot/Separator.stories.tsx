import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '../../src/shadcn/components/ui/separator';

const meta = { title: 'Pilot/Separator', component: Separator } satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Horizontal: Story = { args: { orientation: 'horizontal' } };
export const Vertical: Story = { args: { orientation: 'vertical' } };
