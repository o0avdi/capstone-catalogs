import type { Meta, StoryObj } from '@storybook/angular';
import { StatusNoteComponent as Note } from './status-note.component';

const meta = {
  title: 'Catalog fixture/Status note',
  component: Note,
  args: { label: 'Story label, not the source default', value: 42, tone: 'highlight' },
  argTypes: { value: { control: 'number' } },
  excludeStories: ['NonStory'],
} satisfies Meta<Note>;
export default meta;
type Story = StoryObj<Note>;

export const Numeric: Story = {};
export const Formatted: Story = { name: 'Preformatted value', args: { value: 'Ready', suffix: 'items' } };
export const NonStory = { args: { invented: 'This export is excluded by the official index.' } };
