import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

type AlertDialogArgs = {
  triggerLabel: string;
  title: string;
  description: string;
  cancelLabel: string;
  actionLabel: string;
  actionVariant: 'default' | 'destructive';
  onCancel: () => void;
  onConfirm: () => void;
};

const meta: Meta<AlertDialogArgs> = {
  title: 'Spartan/Alert Dialog',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [
        ...HlmAlertDialogImports,
        ...HlmButtonImports,
      ],
    }),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    triggerLabel: {
      control: 'text',
      description: 'Text displayed inside the button that opens the dialog.',
    },

    title: {
      control: 'text',
      description: 'Heading displayed inside the dialog.',
    },

    description: {
      control: 'text',
      description: 'Supporting message displayed below the heading.',
    },

    cancelLabel: {
      control: 'text',
      description: 'Text displayed inside the cancel button.',
    },

    actionLabel: {
      control: 'text',
      description: 'Text displayed inside the confirmation button.',
    },

    actionVariant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Controls the appearance of the confirmation button.',
    },

    onCancel: {
      control: false,
      description: 'Called when the cancel button is clicked.',
    },

    onConfirm: {
      control: false,
      description: 'Called when the confirmation button is clicked.',
    },
  },

  args: {
    triggerLabel: 'Show dialog',
    title: 'Are you absolutely sure?',
    description:
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    cancelLabel: 'Cancel',
    actionLabel: 'Continue',
    actionVariant: 'default',
    onCancel: fn(),
    onConfirm: fn(),
  },

  render: (args) => ({
    props: {
      ...args,

      handleCancel: () => {
        args.onCancel();
      },

      handleConfirm: () => {
        args.onConfirm();
      },
    },

    template: `
      <hlm-alert-dialog>
        <button
          hlmAlertDialogTrigger
          hlmBtn
          variant="outline"
        >
          {{ triggerLabel }}
        </button>

        <hlm-alert-dialog-content
          *hlmAlertDialogPortal="let context"
        >
          <hlm-alert-dialog-header>
            <h2 hlmAlertDialogTitle>
              {{ title }}
            </h2>

            <p hlmAlertDialogDescription>
              {{ description }}
            </p>
          </hlm-alert-dialog-header>

          <hlm-alert-dialog-footer>
            <button
              hlmAlertDialogCancel
              (click)="handleCancel()"
            >
              {{ cancelLabel }}
            </button>

            <button
              hlmAlertDialogAction
              [variant]="actionVariant"
              (click)="handleConfirm()"
            >
              {{ actionLabel }}
            </button>
          </hlm-alert-dialog-footer>
        </hlm-alert-dialog-content>
      </hlm-alert-dialog>
    `,
  }),
};

export default meta;

type Story = StoryObj<AlertDialogArgs>;

export const Basic: Story = {};

export const DeleteAccount: Story = {
  args: {
    triggerLabel: 'Delete account',
    title: 'Delete your account?',
    description:
      'Your account, saved settings, and associated data will be permanently deleted. This action cannot be reversed.',
    cancelLabel: 'Keep account',
    actionLabel: 'Delete account',
    actionVariant: 'destructive',
  },
};

export const RemoveMember: Story = {
  args: {
    triggerLabel: 'Remove member',
    title: 'Remove this team member?',
    description:
      'The member will immediately lose access to this workspace and its projects.',
    cancelLabel: 'Cancel',
    actionLabel: 'Remove member',
    actionVariant: 'destructive',
  },
};

export const SignOut: Story = {
  args: {
    triggerLabel: 'Sign out',
    title: 'Sign out of your account?',
    description:
      'You will need to enter your email address and password to access your account again.',
    cancelLabel: 'Stay signed in',
    actionLabel: 'Sign out',
    actionVariant: 'default',
  },
};

export const LongContent: Story = {
  args: {
    triggerLabel: 'Replace existing file',
    title: 'A file with this name already exists',
    description:
      'Replacing the existing file will permanently remove its current contents and revision history. Anyone with access to the original file will see the replacement the next time they open it.',
    cancelLabel: 'Keep existing file',
    actionLabel: 'Replace file',
    actionVariant: 'destructive',
  },
};