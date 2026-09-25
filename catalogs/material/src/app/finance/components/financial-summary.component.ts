import { Component, Input } from '@angular/core';
import { FinancialSummaryData } from '../finance.types';
import { FinancePanelComponent } from '../shared/finance-panel.component';
import { MetricCardComponent } from './metric-card.component';
import { formatValue } from '../shared/format-value';

@Component({
  selector: 'finance-financial-summary',
  standalone: true,
  imports: [FinancePanelComponent, MetricCardComponent],
  template: `<finance-panel
    title="Financial position"
    subtitle="Revenue, costs and budget at a glance"
  >
    @if (data) {
      <dl>
        <div>
          <dt>Recognized revenue</dt>
          <dd>{{ money(data.revenue) }}</dd>
        </div>
        <div>
          <dt>Total expenses</dt>
          <dd>{{ money(data.expenses) }}</dd>
        </div>
        <div class="net">
          <dt>Net profit</dt>
          <dd>{{ money(data.revenue - data.expenses) }}</dd>
        </div>
      </dl>
      <finance-metric-card
        label="Profit margin"
        [value]="margin"
        format="percent"
        subtitle="Net profit / recognized revenue"
      />
      @if (data.expenseBudget !== undefined) {
        <div class="budget">
          <div>
            <h3>Expense budget</h3>
            <span>{{ money(data.expenseBudget) }}</span>
          </div>
          <meter
            aria-label="Expense budget used"
            min="0"
            [max]="data.expenseBudget > 0 ? data.expenseBudget : 1"
            [value]="data.expenses"
          ></meter>
          <p [class.over]="data.expenses > data.expenseBudget">
            {{ money(Math.abs(data.expenseBudget - data.expenses)) }}
            {{ data.expenses > data.expenseBudget ? 'over budget' : 'remaining' }}
          </p>
        </div>
      }
    } @else {
      <p class="empty">No financial summary for this period.</p>
    }
  </finance-panel>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        height: 100%;
        font: 13px/1.5 system-ui;
      }
      dl {
        margin: 0 0 22px;
      }
      dl div {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: space-between;
        padding: 12px 0;
      }
      dt {
        color: var(--mat-sys-on-surface-variant);
      }
      dd {
        margin: 0;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        overflow-wrap: anywhere;
      }
      .net {
        border-top: 1px solid var(--mat-sys-outline-variant);
        margin-top: 8px;
      }
      .budget {
        margin-top: 26px;
      }
      .budget div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
      }
      h3 {
        font-size: 12px;
        margin: 0;
      }
      .budget span,
      .budget p {
        font-size: 12px;
        color: var(--mat-sys-on-surface-variant);
      }
      meter {
        width: 100%;
        height: 16px;
        margin-top: 10px;
        accent-color: #24756b;
      }
      .budget .over {
        color: #a33228;
      }
      .empty {
        padding: 48px 0;
        text-align: center;
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
})
export class FinancialSummaryComponent {
  @Input() data?: FinancialSummaryData;
  @Input() currency = 'USD';
  @Input() locale = 'en-US';
  readonly Math = Math;
  get margin(): number | string {
    return this.data?.revenue ? (this.data.revenue - this.data.expenses) / this.data.revenue : '—';
  }
  money(value: number): string {
    return formatValue(value, 'currency', this.currency, this.locale);
  }
}
