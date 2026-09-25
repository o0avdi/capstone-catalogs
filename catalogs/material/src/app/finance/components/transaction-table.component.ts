import { Component, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TransactionData } from '../finance.types';
import { formatValue } from '../shared/format-value';

type SortKey = 'date' | 'description' | 'category' | 'amount' | 'status';
@Component({
  selector: 'finance-transaction-table',
  standalone: true,
  imports: [DatePipe],
  template: `<div class="toolbar">
      <label
        >Search transactions<input
          type="search"
          placeholder="Description or category"
          [value]="query"
          (input)="query = $any($event.target).value"
      /></label>
      <label
        >Status<select [value]="status" (change)="status = $any($event.target).value">
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select></label
      >
    </div>
    <p class="count" aria-live="polite">
      {{ rows.length }} of {{ transactions.length }} transactions
    </p>
    <div
      class="scroll"
      tabindex="0"
      role="region"
      aria-label="Financial transactions, scroll horizontally on small screens"
    >
      <table>
        <caption class="sr-only">
          Financial transactions; positive amounts are inflows and negative amounts are outflows.
        </caption>
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th
                [attr.aria-sort]="
                  sortKey === column.key ? (ascending ? 'ascending' : 'descending') : 'none'
                "
              >
                <button type="button" (click)="sort(column.key)">
                  {{ column.label }}
                  <span aria-hidden="true">{{
                    sortKey === column.key ? (ascending ? '↑' : '↓') : '↕'
                  }}</span>
                </button>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.id) {
            <tr>
              <td class="date">{{ row.date | date: 'MMM d, y' : 'UTC' }}</td>
              <td class="description">{{ row.description }}</td>
              <td>{{ row.category }}</td>
              <td class="amount" [class.inflow]="row.amount > 0">{{ amount(row.amount) }}</td>
              <td>
                <span class="status" [class]="row.status">{{ row.status }}</span>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="empty">
                {{
                  transactions.length
                    ? 'No transactions match your filters.'
                    : 'No transactions for this period.'
                }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>`,
  styleUrls: ['./transaction-table.component.scss'],
})
export class TransactionTableComponent implements OnChanges {
  @Input() transactions: TransactionData[] = [];
  @Input() currency = 'USD';
  @Input() locale = 'en-US';
  query = '';
  status = 'all';
  sortKey: SortKey = 'date';
  ascending = false;
  readonly columns: { key: SortKey; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ];
  ngOnChanges(): void {
    this.query = '';
    this.status = 'all';
  }
  amount(value: number): string {
    return formatValue(value, 'currency', this.currency, this.locale);
  }
  sort(key: SortKey): void {
    this.ascending = this.sortKey === key ? !this.ascending : true;
    this.sortKey = key;
  }
  get rows(): TransactionData[] {
    const query = this.query.trim().toLocaleLowerCase(this.locale);
    return this.transactions
      .filter(
        (row) =>
          (this.status === 'all' || row.status === this.status) &&
          (row.description + ' ' + row.category).toLocaleLowerCase(this.locale).includes(query),
      )
      .sort((a, b) => {
        const left = a[this.sortKey],
          right = b[this.sortKey];
        const order =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right), this.locale);
        return this.ascending ? order : -order;
      });
  }
}
