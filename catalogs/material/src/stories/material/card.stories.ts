import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import type { MatCardAppearance } from '@angular/material/card';

type CardArgs = {
  title: string;
  subtitle: string;
  content: string;
  appearance: MatCardAppearance;
};

const meta: Meta<CardArgs> = {
  title: 'Material/Card',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatCardModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Story text placed inside mat-card-title.',
    },
    subtitle: {
      control: 'text',
      description: 'Optional story text placed inside mat-card-subtitle.',
    },
    content: {
      control: 'text',
      description: 'Story text placed inside mat-card-content.',
    },
    appearance: {
      control: 'select',
      options: ['outlined', 'raised', 'filled'],
      description: 'Material Card appearance input.',
    },
  },
  args: {
    title: 'Monthly summary',
    subtitle: 'September 2026',
    content: 'Review revenue, expenses, and recent account activity.',
    appearance: 'outlined',
  },
  render: (args) => ({
    props: args,
    template: `
      <mat-card
        [appearance]="appearance"
        style="width: 100%; max-width: 420px; overflow-wrap: anywhere;"
      >
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
          @if (subtitle) {
            <mat-card-subtitle>{{ subtitle }}</mat-card-subtitle>
          }
        </mat-card-header>

        <mat-card-content>
          <p>{{ content }}</p>
        </mat-card-content>
      </mat-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<CardArgs>;

export const Outlined: Story = {};

export const Raised: Story = {
  args: {
    appearance: 'raised',
  },
};

export const WithoutSubtitle: Story = {
  args: {
    subtitle: '',
  },
};

export const LongContent: Story = {
  args: {
    title: 'Monthly financial summary and account activity review',
    content:
      'This example uses a longer description to check text wrapping. ' +
      'The card should grow vertically as its content increases and stay ' +
      'within the available width when viewed on a smaller screen.',
  },
};