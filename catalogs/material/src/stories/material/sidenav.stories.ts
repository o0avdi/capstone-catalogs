import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type SidenavMode = 'over' | 'push' | 'side';
type SidenavPosition = 'start' | 'end';

type SidenavArgs = {
  opened: boolean;
  mode: SidenavMode;
  position: SidenavPosition;
  disableClose: boolean;
  onOpenedChange: (opened: boolean) => void;
};

const meta: Meta<SidenavArgs> = {
  title: 'Material/Sidenav',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
      ],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    opened: {
      control: 'boolean',
      description: 'Whether the sidenav is currently visible.',
    },
    mode: {
      control: 'radio',
      options: ['side', 'over', 'push'],
      description:
        'Side reserves space, over covers content, and push moves content aside.',
    },
    position: {
      control: 'radio',
      options: ['start', 'end'],
      description: 'Places the sidenav at the start or end of the container.',
    },
    disableClose: {
      control: 'boolean',
      description:
        'Prevents an over or push sidenav from closing through the backdrop or Escape key.',
    },
    onOpenedChange: {
      control: false,
      description: 'Story callback receiving the new open state.',
    },
  },
  args: {
    opened: true,
    mode: 'side',
    position: 'start',
    disableClose: false,
    onOpenedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SidenavArgs>();

    return {
      props: {
        ...args,
        handleOpenedChange: (opened: boolean) => {
          args.onOpenedChange(opened);
          updateArgs({ opened });
        },
      },
      template: `
        <mat-sidenav-container
          style="height: 420px; border: 1px solid #dadce0; border-radius: 8px;"
        >
          <mat-sidenav
            #sidenav
            [opened]="opened"
            [mode]="mode"
            [position]="position"
            [disableClose]="disableClose"
            (openedChange)="handleOpenedChange($event)"
          >
            <div style="padding: 20px 20px 8px;">
              <strong>Workspace</strong>
            </div>

            <mat-nav-list aria-label="Primary navigation">
              <a mat-list-item href="#" (click)="$event.preventDefault()">
                <mat-icon matListItemIcon aria-hidden="true">home</mat-icon>
                <span matListItemTitle>Home</span>
              </a>
              <a mat-list-item href="#" (click)="$event.preventDefault()">
                <mat-icon matListItemIcon aria-hidden="true">dashboard</mat-icon>
                <span matListItemTitle>Dashboard</span>
              </a>
              <a mat-list-item href="#" (click)="$event.preventDefault()">
                <mat-icon matListItemIcon aria-hidden="true">folder</mat-icon>
                <span matListItemTitle>Projects</span>
              </a>
              <a mat-list-item href="#" (click)="$event.preventDefault()">
                <mat-icon matListItemIcon aria-hidden="true">settings</mat-icon>
                <span matListItemTitle>Settings</span>
              </a>
            </mat-nav-list>
          </mat-sidenav>

          <mat-sidenav-content>
            <div style="padding: 24px;">
              <button
                mat-flat-button
                type="button"
                (click)="sidenav.toggle()"
              >
                {{ opened ? 'Close navigation' : 'Open navigation' }}
              </button>

              <h2 style="margin-top: 32px;">Dashboard</h2>
              <p>
                The main page content remains inside the sidenav container.
              </p>

              <div
                style="height: 160px; margin-top: 24px; border-radius: 8px; background: #e8e8ee;"
              ></div>
            </div>
          </mat-sidenav-content>
        </mat-sidenav-container>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<SidenavArgs>;

export const SideOpen: Story = {};

export const SideClosed: Story = {
  args: {
    opened: false,
  },
};

export const OverContent: Story = {
  args: {
    mode: 'over',
    opened: true,
  },
};

export const PushContent: Story = {
  args: {
    mode: 'push',
    opened: true,
  },
};

export const RightPositioned: Story = {
  args: {
    position: 'end',
  },
};

export const CannotCloseFromBackdrop: Story = {
  args: {
    mode: 'over',
    opened: true,
    disableClose: true,
  },
};
