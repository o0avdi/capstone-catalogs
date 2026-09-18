import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type TabVariant = 'primary' | 'secondary';

type TabsArgs = {
  variant: TabVariant;
  selectedIndex: number;
  stretchTabs: boolean;
  disabledSecondTab: boolean;
  onSelectedIndexChange: (index: number) => void;
};

const meta: Meta<TabsArgs> = {
  title: 'Material/Tabs',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatTabsModule, MatIconModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description:
        'Primary tabs include icons for top-level destinations; secondary tabs use text labels for related content.',
    },
    selectedIndex: {
      control: { type: 'number', min: 0, max: 2, step: 1 },
      description: 'Zero-based index of the selected tab.',
    },
    stretchTabs: {
      control: 'boolean',
      description: 'Whether tabs stretch to fill the available width.',
    },
    disabledSecondTab: {
      control: 'boolean',
      description: 'Whether the second tab is disabled.',
    },
    onSelectedIndexChange: {
      control: false,
      description: 'Story callback receiving the newly selected tab index.',
    },
  },
  args: {
    variant: 'primary',
    selectedIndex: 0,
    stretchTabs: true,
    disabledSecondTab: false,
    onSelectedIndexChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<TabsArgs>();

    const primaryTemplate = `
      <mat-tab-group
        aria-label="Travel sections"
        [selectedIndex]="selectedIndex"
        [stretchTabs]="stretchTabs"
        animationDuration="0ms"
        (selectedIndexChange)="handleSelectedIndexChange($event)"
      >
        <mat-tab>
          <ng-template mat-tab-label>
            <span style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px;">
              <mat-icon aria-hidden="true">flight</mat-icon>
              <span>Flights</span>
            </span>
          </ng-template>
          <p style="padding: 16px;">Search and compare available flights.</p>
        </mat-tab>

        <mat-tab [disabled]="disabledSecondTab">
          <ng-template mat-tab-label>
            <span style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px;">
              <mat-icon aria-hidden="true">luggage</mat-icon>
              <span>Trips</span>
            </span>
          </ng-template>
          <p style="padding: 16px;">Review upcoming and previous trips.</p>
        </mat-tab>

        <mat-tab>
          <ng-template mat-tab-label>
            <span style="display: inline-flex; flex-direction: column; align-items: center; gap: 4px;">
              <mat-icon aria-hidden="true">explore</mat-icon>
              <span>Explore</span>
            </span>
          </ng-template>
          <p style="padding: 16px;">Explore destinations and travel ideas.</p>
        </mat-tab>
      </mat-tab-group>
    `;

    const secondaryTemplate = `
      <mat-tab-group
        aria-label="Product details"
        [selectedIndex]="selectedIndex"
        [stretchTabs]="stretchTabs"
        animationDuration="0ms"
        (selectedIndexChange)="handleSelectedIndexChange($event)"
      >
        <mat-tab label="Overview">
          <p style="padding: 16px;">A summary of the product and its key features.</p>
        </mat-tab>
        <mat-tab label="Specifications" [disabled]="disabledSecondTab">
          <p style="padding: 16px;">Detailed product specifications.</p>
        </mat-tab>
      </mat-tab-group>
    `;

    return {
      props: {
        ...args,
        handleSelectedIndexChange: (index: number) => {
          args.onSelectedIndexChange(index);
          updateArgs({ selectedIndex: index });
        },
      },
      template: `
        <div style="max-width: 720px;">
          ${args.variant === 'primary' ? primaryTemplate : secondaryTemplate}
        </div>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

export const PrimaryTabs: Story = {};

export const SecondaryTabs: Story = {
  args: {
    variant: 'secondary',
  },
};

//Shows which tab is currently active and displays its content.
export const SelectedTab: Story = {
  args: {
    selectedIndex: 1,
  },
};

export const DisabledTab: Story = {
  args: {
    disabledSecondTab: true,
  },
};

//Prevents tabs from stretching across the full width 9allowing them to scroll when there are too many to fit.)
export const ScrollableTabs: Story = {
  args: {
    stretchTabs: false,
  },
};
