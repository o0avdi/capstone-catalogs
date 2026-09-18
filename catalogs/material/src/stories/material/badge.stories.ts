import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatBadgeModule } from '@angular/material/badge';
import type {
  MatBadgePosition,
  MatBadgeSize,
} from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';

type BadgeArgs = {
  label: string;
  count: number;
  hidden: boolean;
  overlap: boolean;
  position: MatBadgePosition;
  size: MatBadgeSize;
};

const meta: Meta<BadgeArgs> = {
  title: 'Material/Badge',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatBadgeModule, MatButtonModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text inside the host button.',
    },
    count: {
      control: { type: 'number', min: 0, step: 1 },
      description: 'Story notification count; values over 99 display as 99+.',
    },
    hidden: {
      control: 'boolean',
      description: 'Maps to matBadgeHidden.',
    },
    overlap: {
      control: 'boolean',
      description: 'Maps to matBadgeOverlap.',
    },
    position: {
    control: 'select',
    options: [
        'above after',
        'above before',
        'below after',
        'below before',
    ],
    description:
        'Maps to matBadgePosition. These are the four distinct positions; ' +
        'Material also accepts shorthand aliases.',
    },
    size: {
    name: 'Badge size',
    control: 'select',
    options: ['small', 'medium'],
    description:
        'Maps to matBadgeSize, not the button size. With our Material 3 theme, ' +
        'small is a dot; medium shows number',
    },
  },
  args: {
    label: 'Notifications',
    count: 4,
    hidden: false,
    overlap: false,
    position: 'above after',
    size: 'medium',
  },
  render: (args) => ({
    props: {
      ...args,
      badgeText: args.count > 99 ? '99+' : String(args.count),
      badgeDescription: args.hidden
        ? ''
        : `${args.count} unread notifications`,
    },
    template: `
      <div style="padding: 24px;">
        <button
          type="button"
          matButton="outlined"
          [matBadge]="badgeText"
          [matBadgeDescription]="badgeDescription"
          [matBadgeHidden]="hidden"
          [matBadgeOverlap]="overlap"
          [matBadgePosition]="position"
          [matBadgeSize]="size"
        >
          {{ label }}
        </button>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Basic: Story = {};

export const LargeCount: Story = {
  args: {
    count: 128,
  },
};

export const Hidden: Story = {
  args: {
    hidden: true,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const BelowBefore: Story = {
  args: {
    position: 'below before',
  },
};