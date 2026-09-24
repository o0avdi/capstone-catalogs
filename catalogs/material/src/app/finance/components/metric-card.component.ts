import { Component, Input } from '@angular/core';
export type MetricState = 'positive' | 'negative' | 'neutral';
@Component({
  selector: 'finance-metric-card',
  standalone: true,
  template: `<section class="metric" [class]="state" [attr.aria-label]="label + ': ' + value">
    <p>{{ label }}</p>
    <strong>{{ value }}</strong
    ><span *ngIf="change">{{ change }}</span
    ><small *ngIf="helper">{{ helper }}</small>
  </section>`,
  styles: [
    `
      .metric {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 18px;
        display: grid;
        gap: 7px;
        box-shadow: 0 1px 2px #0f172a0d;
      }
      .metric p,
      .metric small {
        margin: 0;
        color: #64748b;
        font: 500 13px/1.3 system-ui;
      }
      .metric strong {
        font: 650 26px/1.1 system-ui;
        color: #0f172a;
      }
      .metric span {
        font: 600 13px system-ui;
      }
      .positive span {
        color: #15803d;
      }
      .negative span {
        color: #b91c1c;
      }
      .neutral span {
        color: #475569;
      }
    `,
  ],
})
export class MetricCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() change?: string;
  @Input() helper?: string;
  @Input() state: MetricState = 'neutral';
}
