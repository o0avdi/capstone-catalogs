import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from '../../src/shadcn/components/ui/progress';

const meta = { title: 'Pilot/Progress', component: Progress } satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { value: 40 } };
