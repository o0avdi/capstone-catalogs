import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideClock,
  lucideFileText,
  lucideFileWarning,
  lucideRefreshCw,
  lucideX,
} from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { fn } from 'storybook/test';

type AttachmentState =
  | 'idle'
  | 'uploading'
  | 'processing'
  | 'error'
  | 'done';

type AttachmentSize = 'default' | 'sm' | 'xs';

type AttachmentOrientation = 'horizontal' | 'vertical';

type AttachmentArgs = {
  fileName: string;
  description: string;
  state: AttachmentState;
  size: AttachmentSize;
  orientation: AttachmentOrientation;
  showActions: boolean;
  onRemove: () => void;
  onRetry: () => void;
};

const meta: Meta<AttachmentArgs> = {
  title: 'Spartan/Attachment',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [...HlmAttachmentImports, NgIcon],
      providers: [
        provideIcons({
          lucideCheck,
          lucideClock,
          lucideFileText,
          lucideFileWarning,
          lucideRefreshCw,
          lucideX,
        }),
      ],
    }),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    fileName: {
      control: 'text',
      description: 'Name of the attached file.',
    },

    description: {
      control: 'text',
      description: 'File type, size, or current upload status.',
    },

    state: {
      control: 'select',
      options: ['idle', 'uploading', 'processing', 'error', 'done'],
      description: 'Current state of the attachment.',
    },

    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
      description: 'Controls the size of the attachment.',
    },

    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Controls the layout direction of the attachment.',
    },

    showActions: {
      control: 'boolean',
      description: 'Shows or hides attachment action buttons.',
    },

    onRemove: {
      control: false,
      description: 'Called when the remove button is clicked.',
    },

    onRetry: {
      control: false,
      description: 'Called when the retry button is clicked.',
    },
  },

  args: {
    fileName: 'project-brief.pdf',
    description: 'PDF · 2.4 MB',
    state: 'done',
    size: 'default',
    orientation: 'horizontal',
    showActions: true,
    onRemove: fn(),
    onRetry: fn(),
  },

  render: (args) => ({
    props: {
      ...args,

      handleRemove: () => {
        args.onRemove();
      },

      handleRetry: () => {
        args.onRetry();
      },
    },

    template: `
      <div
        hlmAttachment
        [state]="state"
        [size]="size"
        [orientation]="orientation"
        [class.w-full]="orientation === 'horizontal'"
        class="max-w-sm"
      >
        <div hlmAttachmentMedia>
          @switch (state) {
            @case ('idle') {
              <ng-icon name="lucideClock" />
            }

            @case ('error') {
              <ng-icon name="lucideFileWarning" />
            }

            @case ('done') {
              <ng-icon name="lucideCheck" />
            }

            @default {
              <ng-icon name="lucideFileText" />
            }
          }
        </div>

        <div hlmAttachmentContent>
          <span hlmAttachmentTitle>
            {{ fileName }}
          </span>

          <span hlmAttachmentDescription>
            {{ description }}
          </span>
        </div>

        @if (showActions) {
          <div hlmAttachmentActions>
            @if (state === 'error') {
              <button
                hlmAttachmentAction
                aria-label="Retry upload"
                (click)="handleRetry()"
              >
                <ng-icon name="lucideRefreshCw" />
              </button>
            }

            <button
              hlmAttachmentAction
              [attr.aria-label]="'Remove ' + fileName"
              (click)="handleRemove()"
            >
              <ng-icon name="lucideX" />
            </button>
          </div>
        }
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<AttachmentArgs>;

export const Basic: Story = {};

export const ReadyToUpload: Story = {
  args: {
    fileName: 'selected-file.pdf',
    description: 'Ready to upload',
    state: 'idle',
  },
};

export const Uploading: Story = {
  args: {
    fileName: 'design-system.zip',
    description: 'Uploading · 64%',
    state: 'uploading',
  },
};

export const Processing: Story = {
  args: {
    fileName: 'market-research.pdf',
    description: 'Processing document',
    state: 'processing',
  },
};

export const UploadError: Story = {
  args: {
    fileName: 'financial-model.xlsx',
    description: 'Upload failed. Try again.',
    state: 'error',
  },
};

export const Completed: Story = {
  args: {
    fileName: 'uploaded-report.pdf',
    description: 'Uploaded · 1.8 MB',
    state: 'done',
  },
};

export const Small: Story = {
  args: {
    fileName: 'small-document.pdf',
    description: 'PDF · 850 KB',
    size: 'sm',
  },
};

export const ExtraSmall: Story = {
  args: {
    fileName: 'notes.txt',
    description: 'TXT · 4 KB',
    size: 'xs',
  },
};

export const Vertical: Story = {
  args: {
    fileName: 'presentation.pdf',
    description: 'PDF · 6.2 MB',
    orientation: 'vertical',
  },
};

export const WithoutActions: Story = {
  args: {
    fileName: 'read-only-document.pdf',
    description: 'PDF · 1.1 MB',
    showActions: false,
  },
};

export const LongFileName: Story = {
  args: {
    fileName:
      'quarterly-financial-results-and-projections-final-version.pdf',
    description: 'PDF · 12.8 MB',
  },
};