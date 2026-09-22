import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideInfo,
  lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

type AlertArgs = {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
  icon: 'success' | 'info' | 'warning' | 'error' | 'none';
};

const iconNames: Record<AlertArgs['icon'], string> = {
  success: 'lucideCircleCheck',
  info: 'lucideInfo',
  warning: 'lucideTriangleAlert',
  error: 'lucideCircleAlert',
  none: '',
};

const meta: Meta<AlertArgs> = {
  title: 'Spartan/Alert',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [...HlmAlertImports, NgIcon],
      providers: [
        provideIcons({
          lucideCircleAlert,
          lucideCircleCheck,
          lucideInfo,
          lucideTriangleAlert,
        }),
      ],
    }),
  ],

  parameters: {
    layout: 'padded',
  },

  argTypes: {
    title: {
      control: 'text',
      description: 'Heading displayed inside the alert.',
    },

    description: {
      control: 'text',
      description: 'Supporting message displayed below the heading.',
    },

    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Controls the visual appearance of the alert.',
    },

    icon: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error', 'none'],
      description: 'Selects the icon displayed inside the alert.',
    },
  },

  args: {
    title: 'Payment successful',
    description:
      'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
    variant: 'default',
    icon: 'success',
  },

  render: (args) => ({
    props: {
      ...args,
      iconName: iconNames[args.icon],
    },

    template: `
      <hlm-alert
        class="w-full max-w-md"
        [variant]="variant"
      >
        @if (iconName) {
          <ng-icon [name]="iconName" />
        }

        <h4 hlmAlertTitle>
          {{ title }}
        </h4>

        <p hlmAlertDescription>
          {{ description }}
        </p>
      </hlm-alert>
    `,
  }),
};

export default meta;

type Story = StoryObj<AlertArgs>;

export const Basic: Story = {};

export const Information: Story = {
  args: {
    title: 'New feature available',
    description:
      'Dark mode is now available. You can enable it from your account settings.',
    variant: 'default',
    icon: 'info',
  },
};

export const Warning: Story = {
  args: {
    title: 'Subscription ending soon',
    description:
      'Your subscription expires in three days. Update your billing information to prevent interruption.',
    variant: 'default',
    icon: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    title: 'Unable to save changes',
    description:
      'Something went wrong while saving your changes. Check your connection and try again.',
    variant: 'destructive',
    icon: 'error',
  },
};

export const WithoutIcon: Story = {
  args: {
    title: 'Scheduled maintenance',
    description:
      'The service will be unavailable on Sunday between 2:00 AM and 3:00 AM.',
    variant: 'default',
    icon: 'none',
  },
};

export const LongContent: Story = {
  args: {
    title: 'Important account information',
    description:
      'We updated our account security process. The next time you sign in from a new device, you may be asked to verify your identity using the email address connected to your account.',
    variant: 'default',
    icon: 'info',
  },
};