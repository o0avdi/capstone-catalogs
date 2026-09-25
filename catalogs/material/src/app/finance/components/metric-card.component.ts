import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MetricState, ValueFormat } from '../finance.types';
import { formatValue } from '../shared/format-value';
export type { MetricState } from '../finance.types';

@Component({
  selector: 'finance-metric-card',
  standalone: true,
  imports: [MatCardModule],
  template: `<mat-card appearance="outlined" [attr.aria-label]="label + ': ' + formattedValue">
    <div class="heading">
      <p>{{ label }}</p>
      @if (icon) {
        <span class="icon" aria-hidden="true">{{ icon }}</span>
      }
    </div>
    <strong>{{ formattedValue }}</strong>
    @if (subtitle) {
      <p class="subtitle">{{ subtitle }}</p>
    }
    @if (change !== undefined || helper) {
      <div class="comparison">
        @if (change !== undefined) {
          <span class="change" [class]="state"
            ><span class="sr-only">{{
              state === 'positive' ? 'Favorable: ' : state === 'negative' ? 'Unfavorable: ' : ''
            }}</span
            >{{ formattedChange }}</span
          >
        }
        @if (helper) {
          <small>{{ helper }}</small>
        }
      </div>
    }
  </mat-card>`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
        height: 100%;
      }
      mat-card {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        gap: 14px;
        padding: 22px;
        border-radius: 16px;
        border-color: var(--mat-sys-outline-variant, #dde3ea);
        background: var(--mat-sys-surface-container-lowest, #fff);
        box-shadow: none;
      }
      .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      p {
        margin: 0;
        font: 500 13px/1.4 system-ui;
        color: var(--mat-sys-on-surface-variant, #526173);
      }
      .icon {
        font: 600 16px system-ui;
        color: var(--mat-sys-primary, #005cbb);
        background: var(--mat-sys-primary-container, #e5efff);
        padding: 7px 10px;
        border-radius: 9px;
      }
      strong {
        font: 650 clamp(24px, 2.3vw, 34px)/1.15 system-ui;
        letter-spacing: -1px;
        overflow-wrap: anywhere;
        font-variant-numeric: tabular-nums;
        color: var(--mat-sys-on-surface, #172b42);
      }
      .comparison {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: auto;
        min-height: 24px;
      }
      small {
        font: 400 11px/1.5 system-ui;
        color: var(--mat-sys-on-surface-variant, #526173);
      }
      .change {
        font: 600 12px/1.5 system-ui;
        padding: 3px 7px;
        border-radius: 6px;
      }
      .positive {
        color: #126448;
        background: #e6f4ed;
      }
      .negative {
        color: #a33228;
        background: #fff0ed;
      }
      .neutral {
        color: #45566b;
        background: #edf1f5;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
      }
    `,
  ],
})
export class MetricCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value: number | string = '';
  @Input() format: ValueFormat = 'currency';
  @Input() currency = 'USD';
  @Input() locale = 'en-US';
  @Input() subtitle?: string;
  @Input() change?: number | string;
  @Input() changeFormat: ValueFormat = 'percent';
  @Input() helper?: string;
  @Input() icon?: string;
  @Input() state: MetricState = 'neutral';
  get formattedValue(): string {
    return formatValue(this.value, this.format, this.currency, this.locale);
  }
  get formattedChange(): string {
    return typeof this.change === 'number'
      ? `${this.change > 0 ? '+' : ''}${formatValue(this.change, this.changeFormat, this.currency, this.locale)}`
      : (this.change ?? '');
  }
}
