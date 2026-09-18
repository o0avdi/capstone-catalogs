import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import type { Sort, SortDirection } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

type ProductRow = {
  name: string;
  category: string;
  price: number;
  stock: number;
};

type SortArgs = {
  active: string;
  direction: SortDirection;
  disableClear: boolean;
  disabled: boolean;
  data: ProductRow[];
  onSortChange: (sort: Sort) => void;
};

const productRows: ProductRow[] = [
  { name: 'Travel mug', category: 'Kitchen', price: 24, stock: 18 },
  { name: 'Desk lamp', category: 'Office', price: 46.5, stock: 7 },
  { name: 'Canvas tote', category: 'Accessories', price: 18, stock: 31 },
  { name: 'Headphones', category: 'Electronics', price: 79.99, stock: 12 },
  { name: 'Weekly planner', category: 'Office', price: 18.95, stock: 24 },
];

function sortRows(
  data: ProductRow[],
  active: string,
  direction: SortDirection,
): ProductRow[] {
  if (!active || !direction) {
    return [...data];
  }

  return [...data].sort((first, second) => {
    let comparison = 0;

    switch (active) {
      case 'name':
        comparison = first.name.localeCompare(second.name);
        break;
      case 'category':
        comparison = first.category.localeCompare(second.category);
        break;
      case 'price':
        comparison = first.price - second.price;
        break;
      case 'stock':
        comparison = first.stock - second.stock;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

const meta: Meta<SortArgs> = {
  title: 'Material/Sort',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatTableModule, MatSortModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    active: {
      control: 'select',
      options: ['', 'name', 'category', 'price', 'stock'],
      description: 'ID of the column currently being sorted.',
    },
    direction: {
      control: 'select',
      options: ['', 'asc', 'desc'],
      description: 'Current sorting direction.',
    },
    disableClear: {
      control: 'boolean',
      description: 'Prevents the sort from returning to an unsorted state.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all sortable headers.',
    },
    data: {
      control: 'object',
      description: 'Rows displayed in the sortable table.',
    },
    onSortChange: {
      control: false,
      description: 'Story callback receiving the active column and direction.',
    },
  },
  args: {
    active: '',
    direction: '',
    disableClear: false,
    disabled: false,
    data: productRows,
    onSortChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<SortArgs>();

    return {
      props: {
        ...args,
        displayedColumns: ['name', 'category', 'price', 'stock'],
        sortedData: sortRows(args.data, args.active, args.direction),
        handleSortChange: (sort: Sort) => {
          args.onSortChange(sort);
          updateArgs({
            active: sort.active,
            direction: sort.direction,
          });
        },
      },
      template: `
        <div style="max-width: 900px; overflow-x: auto;">
          <table
            mat-table
            matSort
            [dataSource]="sortedData"
            [matSortActive]="active"
            [matSortDirection]="direction"
            [matSortDisableClear]="disableClear"
            [matSortDisabled]="disabled"
            (matSortChange)="handleSortChange($event)"
            style="width: 100%;"
          >
            <caption style="padding: 16px; text-align: left; font-size: 20px; font-weight: 500;">
              Product inventory
            </caption>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="name">
                Product
              </th>
              <td mat-cell *matCellDef="let row">{{ row.name }}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="category">
                Category
              </th>
              <td mat-cell *matCellDef="let row">{{ row.category }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="price">
                Price
              </th>
              <td mat-cell *matCellDef="let row">{{ row.price }}</td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef mat-sort-header="stock">
                In stock
              </th>
              <td mat-cell *matCellDef="let row">{{ row.stock }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      `,
    };
  },
};

export default meta;
type Story = StoryObj<SortArgs>;

export const Unsorted: Story = {};

export const Ascending: Story = {
  args: {
    active: 'name',
    direction: 'asc',
  },
};

export const Descending: Story = {
  args: {
    active: 'price',
    direction: 'desc',
  },
};

//can't be unsorted is either asc/desc
export const DisableClear: Story = {
  args: {
    active: 'category',
    direction: 'asc',
    disableClear: true,
  },
};

export const Disabled: Story = {
  args: {
    active: 'stock',
    direction: 'asc',
    disabled: true,
  },
};
