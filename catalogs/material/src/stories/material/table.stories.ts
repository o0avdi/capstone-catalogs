import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatTableModule } from '@angular/material/table';
import { fn } from 'storybook/test';
import { MatCheckboxModule } from '@angular/material/checkbox';

type TableRow = {
  item: string;
  category: string;
  quantity: number;
  price: string;
};

type TableArgs = {
  caption: string;
  data: TableRow[];
  showFooter: boolean;
  onRowClick: (row: TableRow) => void;
};

const standardRows: TableRow[] = [
  { item: 'Wireless headphones', category: 'Electronics', quantity: 2, price: '$159.98' },
  { item: 'Notebook set', category: 'Office', quantity: 4, price: '$31.96' },
  { item: 'Travel mug', category: 'Kitchen', quantity: 1, price: '$24.00' },
  { item: 'Desk lamp', category: 'Office', quantity: 1, price: '$46.50' },
];

const manyRows: TableRow[] = [
  ...standardRows,
  { item: 'Charging cable', category: 'Electronics', quantity: 3, price: '$38.97' },
  { item: 'Canvas tote', category: 'Accessories', quantity: 2, price: '$36.00' },
  { item: 'Water bottle', category: 'Outdoors', quantity: 2, price: '$44.00' },
  { item: 'Weekly planner', category: 'Office', quantity: 1, price: '$18.95' },
];

const meta: Meta<TableArgs> = {
  title: 'Material/Table',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [MatTableModule, MatCheckboxModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    caption: {
      control: 'text',
      description: 'Accessible title describing the table contents.',
    },
    data: {
      control: 'object',
      description: 'Rows displayed by the Material table.',
    },
    showFooter: {
      control: 'boolean',
      description: 'Whether the summary footer row is displayed.',
    },
    onRowClick: {
      control: false,
      description: 'Story callback receiving the row selected by the user.',
    },
  },
  args: {
    caption: 'Order items',
    data: standardRows,
    showFooter: false,
    onRowClick: fn(),
  },
  render: (args) => ({
    props: {
      ...args,
      displayedColumns: ['item', 'category', 'quantity', 'price'],
      handleRowClick: (row: TableRow) => args.onRowClick(row),
    },
    template: `
      <div style="max-width: 900px; overflow-x: auto;">
        <table mat-table [dataSource]="data" style="width: 100%;">
          <caption style="padding: 16px; text-align: left; font-size: 20px; font-weight: 500;">
            {{ caption }}
          </caption>

          <ng-container matColumnDef="item">
            <th mat-header-cell *matHeaderCellDef>Item</th>
            <td mat-cell *matCellDef="let row">{{ row.item }}</td>
            <td mat-footer-cell *matFooterCellDef>Total</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let row">{{ row.category }}</td>
            <td mat-footer-cell *matFooterCellDef></td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef style="text-align: right;">Quantity</th>
            <td mat-cell *matCellDef="let row" style="text-align: right;">{{ row.quantity }}</td>
            <td mat-footer-cell *matFooterCellDef style="text-align: right;">8</td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef style="text-align: right;">Price</th>
            <td mat-cell *matCellDef="let row" style="text-align: right;">{{ row.price }}</td>
            <td mat-footer-cell *matFooterCellDef style="text-align: right;">$262.44</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            (click)="handleRowClick(row)"
            style="cursor: pointer;"
          ></tr>
          <tr
            mat-footer-row
            *matFooterRowDef="displayedColumns"
            [hidden]="!showFooter"
          ></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length" style="padding: 24px; text-align: center;">
              No order items to display.
            </td>
          </tr>
        </table>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<TableArgs>;

export const BasicTable: Story = {};

export const WithFooter: Story = {
  args: {
    showFooter: true,
  },
};

export const EmptyTable: Story = {
  args: {
    caption: 'Order items — empty',
    data: [],
  },
};

export const LongContent: Story = {
  args: {
    data: [
      {
        item: 'Noise-cancelling wireless headphones with protective travel case',
        category: 'Consumer electronics and accessories',
        quantity: 2,
        price: '$159.98',
      },
      ...standardRows.slice(1),
    ],
  },
};

export const ManyRows: Story = {
  args: {
    caption: 'Complete order',
    data: manyRows,
  },
};

//add checkboxes to table
export const WithCheckboxes: Story = {
  render: (args) => {
    const selectedItems = new Set<string>();

    return {
      props: {
        ...args,
        displayedColumns: [
          'select',
          'item',
          'category',
          'quantity',
          'price',
        ],
        selectedItems,

        isAllSelected: () =>
          args.data.length > 0 &&
          selectedItems.size === args.data.length,

        toggleAll: (checked: boolean) => {
          selectedItems.clear();

          if (checked) {
            args.data.forEach((row) => selectedItems.add(row.item));
          }
        },

        toggleRow: (row: TableRow) => {
          if (selectedItems.has(row.item)) {
            selectedItems.delete(row.item);
          } else {
            selectedItems.add(row.item);
          }
        },
      },

      template: `
        <div style="max-width: 900px; overflow-x: auto;">
          <table mat-table [dataSource]="data" style="width: 100%;">
            <caption
              style="padding: 16px; text-align: left;
                     font-size: 20px; font-weight: 500;"
            >
              Select order items
            </caption>

            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox
                  aria-label="Select all rows"
                  [checked]="isAllSelected()"
                  [indeterminate]="
                    selectedItems.size > 0 && !isAllSelected()
                  "
                  (change)="toggleAll($event.checked)"
                ></mat-checkbox>
              </th>

              <td mat-cell *matCellDef="let row">
                <mat-checkbox
                  [attr.aria-label]="'Select ' + row.item"
                  [checked]="selectedItems.has(row.item)"
                  (click)="$event.stopPropagation()"
                  (change)="toggleRow(row)"
                ></mat-checkbox>
              </td>
            </ng-container>

            <ng-container matColumnDef="item">
              <th mat-header-cell *matHeaderCellDef>Item</th>
              <td mat-cell *matCellDef="let row">
                {{ row.item }}
              </td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let row">
                {{ row.category }}
              </td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th
                mat-header-cell
                *matHeaderCellDef
                style="text-align: right;"
              >
                Quantity
              </th>
              <td
                mat-cell
                *matCellDef="let row"
                style="text-align: right;"
              >
                {{ row.quantity }}
              </td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th
                mat-header-cell
                *matHeaderCellDef
                style="text-align: right;"
              >
                Price
              </th>
              <td
                mat-cell
                *matCellDef="let row"
                style="text-align: right;"
              >
                {{ row.price }}
              </td>
            </ng-container>

            <tr
              mat-header-row
              *matHeaderRowDef="displayedColumns"
            ></tr>

            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
            ></tr>
          </table>
        </div>
      `,
    };
  },
};
