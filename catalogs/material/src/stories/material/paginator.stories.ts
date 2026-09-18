import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatPaginatorModule } from '@angular/material/paginator';

type PaginatorArgs = {
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageIndex: number;
  showFirstLastButtons: boolean;
  hidePageSize: boolean;
  disabled: boolean;
};

const meta: Meta<PaginatorArgs> = {
  title: 'Material/Paginator',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatPaginatorModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    length: {
      control: 'number',
      description: 'Total number of items being paginated.',
    },
    pageSize: {
      control: 'number',
      description: 'Number of items displayed on each page.',
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Available page size options.',
    },
    pageIndex: {
      control: 'number',
      description: 'Zero-based index of the currently selected page.',
    },
    showFirstLastButtons: {
      control: 'boolean',
      description: 'Whether to show first and last page navigation buttons.',
    },
    hidePageSize: {
      control: 'boolean',
      description: 'Whether to hide the page size selector.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the paginator is disabled.',
    },
  },
  args: {
    length: 100,
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 100],
    pageIndex: 0,
    showFirstLastButtons: false,
    hidePageSize: false,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <mat-paginator
        [length]="length"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        [pageIndex]="pageIndex"
        [showFirstLastButtons]="showFirstLastButtons"
        [hidePageSize]="hidePageSize"
        [disabled]="disabled"
        aria-label="Select page"
      >
      </mat-paginator>
    `,
  }),
};

export default meta;
type Story = StoryObj<PaginatorArgs>;

export const Default: Story = {};

export const FirstAndLastButtons: Story = {
  args: {
    showFirstLastButtons: true,
  },
};

export const MiddlePage: Story = {
  args: {
    pageIndex: 4,
  },
};

export const LastPage: Story = {
  args: {
    pageIndex: 9,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const HidePageSize: Story = {
  args: {
    hidePageSize: true,
  },
};

export const LargeDataset: Story = {
  args: {
    length: 10000,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    pageIndex: 49,
    showFirstLastButtons: true,
  },
};

export const SinglePage: Story = {
  args: {
    length: 8,
    pageSize: 10,
  },
};

export const Empty: Story = {
  args: {
    length: 0,
  },
};