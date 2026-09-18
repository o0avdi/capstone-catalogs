import { Component, Input } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import type {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fn } from 'storybook/test';

type SnackBarArgs = {
  message: string;
  action: string;
  duration: number;
  horizontalPosition: MatSnackBarHorizontalPosition;
  verticalPosition: MatSnackBarVerticalPosition;
  onAction: () => void;
  onDismissed: (dismissedByAction: boolean) => void;
};

@Component({
  selector: 'storybook-snack-bar-host',
  standalone: false,
  template: `
    <div style="min-height: 240px; display: grid; place-items: center;">
      <button mat-flat-button type="button" (click)="openSnackBar()">
        Show snackbar
      </button>
    </div>
  `,
})
class SnackBarStoryHostComponent {
  @Input() message = '';
  @Input() action = '';
  @Input() duration = 4000;
  @Input() horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  @Input() verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  @Input() onAction: () => void = () => undefined;
  @Input() onDismissed: (dismissedByAction: boolean) => void = () => undefined;

  constructor(private readonly snackBar: MatSnackBar) {}

  openSnackBar(): void {
    const reference = this.snackBar.open(
      this.message,
      this.action || undefined,
      {
        duration: this.duration,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        politeness: 'polite',
      },
    );

    reference.onAction().subscribe(() => this.onAction());
    reference.afterDismissed().subscribe((event) => {
      this.onDismissed(event.dismissedByAction);
    });
  }
}

const meta: Meta<SnackBarArgs> = {
  title: 'Material/Snack Bar',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [SnackBarStoryHostComponent],
      imports: [MatSnackBarModule, MatButtonModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Brief feedback message shown to the user.',
    },
    action: {
      control: 'text',
      description: 'Optional action button label. Leave blank for no action.',
    },
    duration: {
      control: { type: 'number', min: 0, step: 500 },
      description: 'Time in milliseconds before dismissal. Use 0 to remain open.',
    },
    horizontalPosition: {
      control: 'select',
      options: ['start', 'center', 'end', 'left', 'right'],
      description: 'Horizontal placement of the snackbar.',
    },
    verticalPosition: {
      control: 'radio',
      options: ['top', 'bottom'],
      description: 'Vertical placement of the snackbar.',
    },
    onAction: {
      control: false,
      description: 'Story callback fired when the action button is selected.',
    },
    onDismissed: {
      control: false,
      description: 'Story callback fired when the snackbar closes.',
    },
  },
  args: {
    message: 'Your changes have been saved.',
    action: '',
    duration: 4000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    onAction: fn(),
    onDismissed: fn(),
  },
  render: (args) => ({
    props: args,
    template: `
      <storybook-snack-bar-host
        [message]="message"
        [action]="action"
        [duration]="duration"
        [horizontalPosition]="horizontalPosition"
        [verticalPosition]="verticalPosition"
        [onAction]="onAction"
        [onDismissed]="onDismissed"
      ></storybook-snack-bar-host>
    `,
  }),
};

export default meta;
type Story = StoryObj<SnackBarArgs>;

export const AutoDismiss: Story = {};

export const PersistentWithAction: Story = {
  args: {
    message: 'Message deleted.',
    action: 'Undo',
    duration: 0,
  },
};

export const PersistentDismiss: Story = {
  args: {
    message: 'You are currently offline.',
    action: 'Dismiss',
    duration: 0,
  },
};

export const TopCentered: Story = {
  args: {
    message: 'New notification received.',
    duration: 5000,
    verticalPosition: 'top',
  },
};

export const LongMessage: Story = {
  args: {
    message:
      'Your report is being prepared. You can continue working while it finishes.',
    action: 'View',
    duration: 6000,
  },
};
