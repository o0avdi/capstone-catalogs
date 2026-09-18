import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

type ToolbarArgs = {
  disabled: boolean;
};

const meta: Meta<ToolbarArgs> = {
  title: 'Material/Toolbar',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
      ],
    }),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether toolbar actions are disabled.',
    },
  },

  args: {
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<ToolbarArgs>;

export const Standard: Story = {
  render: (args) => ({
    props: args,

    template: `
      <mat-toolbar class="floating-toolbar">

        <button
          mat-icon-button
          type="button"
          aria-label="Back"
          [disabled]="disabled"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Forward"
          [disabled]="disabled"
        >
          <mat-icon>arrow_forward</mat-icon>
        </button>

        <button
          mat-fab
          class="toolbar-fab"
          type="button"
          aria-label="Add"
          [disabled]="disabled"
        >
          <mat-icon>add</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Archive"
          [disabled]="disabled"
        >
          <mat-icon>archive</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="More options"
          [matMenuTriggerFor]="standardMenu"
          [disabled]="disabled"
        >
          <mat-icon>more_vert</mat-icon>
        </button>

        <mat-menu #standardMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>edit</mat-icon>
            <span>Edit</span>
          </button>

          <button mat-menu-item>
            <mat-icon>delete</mat-icon>
            <span>Delete</span>
          </button>
        </mat-menu>

      </mat-toolbar>
    `,

    styles: [
      `
        .floating-toolbar {
          width: auto;
          gap: 8px;
          border-radius: 32px;
          padding: 6px 12px;
        }

        .toolbar-fab {
          width: 48px;
          height: 48px;
          box-shadow: none;
        }
      `,
    ],
  }),
};

export const Formatting: Story = {
  render: (args) => ({
    props: args,

    template: `
      <mat-toolbar class="floating-toolbar">

        <button
          mat-icon-button
          type="button"
          aria-label="Bold"
          [disabled]="disabled"
        >
          <mat-icon>format_bold</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Italic"
          [disabled]="disabled"
        >
          <mat-icon>format_italic</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Underline"
          [disabled]="disabled"
        >
          <mat-icon>format_underlined</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Text color"
          [disabled]="disabled"
        >
          <mat-icon>format_color_text</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Highlight color"
          [disabled]="disabled"
        >
          <mat-icon>format_color_fill</mat-icon>
        </button>

      </mat-toolbar>
    `,

    styles: [
      `
        .floating-toolbar {
          width: auto;
          gap: 8px;
          border-radius: 32px;
          padding: 6px 12px;
        }
      `,
    ],
  }),
};

export const Vertical: Story = {
  render: (args) => ({
    props: args,

    template: `
      <mat-toolbar class="vertical-toolbar">

        <button
          mat-icon-button
          type="button"
          aria-label="Undo"
          [disabled]="disabled"
        >
          <mat-icon>undo</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Redo"
          [disabled]="disabled"
        >
          <mat-icon>redo</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Add"
          [disabled]="disabled"
        >
          <mat-icon>add</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Text formatting"
          [disabled]="disabled"
        >
          <mat-icon>format_color_text</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="More options"
          [matMenuTriggerFor]="verticalMenu"
          [disabled]="disabled"
        >
          <mat-icon>more_vert</mat-icon>
        </button>

        <mat-menu #verticalMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>

          <button mat-menu-item>
            <mat-icon>help</mat-icon>
            <span>Help</span>
          </button>
        </mat-menu>

      </mat-toolbar>
    `,

    styles: [
      `
        .vertical-toolbar {
          width: 72px;
          height: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-radius: 36px;
          padding: 12px 6px;
        }
      `,
    ],
  }),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },

  render: (args) => ({
    props: args,

    template: `
      <mat-toolbar class="full-width-toolbar">

        <button
          mat-icon-button
          type="button"
          aria-label="Back"
          [disabled]="disabled"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="Forward"
          [disabled]="disabled"
        >
          <mat-icon>arrow_forward</mat-icon>
        </button>

        <button
          mat-fab
          class="toolbar-fab"
          type="button"
          aria-label="Add"
          [disabled]="disabled"
        >
          <mat-icon>add</mat-icon>
        </button>

        <span class="toolbar-spacer"></span>

        <button
          mat-icon-button
          type="button"
          aria-label="Archive"
          [disabled]="disabled"
        >
          <mat-icon>archive</mat-icon>
        </button>

        <button
          mat-icon-button
          type="button"
          aria-label="More options"
          [disabled]="disabled"
        >
          <mat-icon>more_vert</mat-icon>
        </button>

      </mat-toolbar>
    `,

    styles: [
      `
        .full-width-toolbar {
          width: 100%;
          gap: 12px;
        }

        .toolbar-spacer {
          flex: 1 1 auto;
        }

        .toolbar-fab {
          width: 48px;
          height: 48px;
          box-shadow: none;
        }
      `,
    ],
  }),
};

export const TextActions: Story = {
  parameters: {
    layout: 'padded',
  },

  render: (args) => ({
    props: args,

    template: `
      <mat-toolbar class="text-toolbar">

        <button
          mat-button
          type="button"
          [disabled]="disabled"
        >
          Back
        </button>

        <span class="toolbar-spacer"></span>

        <button
          mat-flat-button
          type="button"
          [disabled]="disabled"
        >
          Next
        </button>

      </mat-toolbar>
    `,

    styles: [
      `
        .text-toolbar {
          width: 100%;
        }

        .toolbar-spacer {
          flex: 1 1 auto;
        }
      `,
    ],
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },

  render: Standard.render,
};