import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../src/shadcn/components/ui/badge';

const meta = { title: 'Pilot/Badge', component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { variant: 'default', children: 'Review' } };
