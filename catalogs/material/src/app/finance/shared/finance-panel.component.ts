import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

/** Team-owned wrapper around Angular Material's card, with projected content. */
@Component({
  selector: 'finance-panel',
  standalone: true,
  imports: [MatCardModule],
  template: `<mat-card appearance="outlined"
    ><header>
      <h2>{{ title }}</h2>
      @if (subtitle) {
        <p>{{ subtitle }}</p>
      }
    </header>
    <ng-content
  /></mat-card>`,
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
        padding: 24px;
        border-color: var(--mat-sys-outline-variant, #dde3ea);
        border-radius: 16px;
        background: var(--mat-sys-surface-container-lowest, #fff);
        box-shadow: none;
      }
      header {
        margin-bottom: 24px;
      }
      h2 {
        font: 600 17px/1.4 system-ui;
        margin: 0;
        color: var(--mat-sys-on-surface, #172b42);
      }
      p {
        font: 400 13px/1.6 system-ui;
        color: var(--mat-sys-on-surface-variant, #526173);
        margin: 6px 0 0;
      }
      @media (max-width: 600px) {
        mat-card {
          padding: 18px;
        }
      }
    `,
  ],
})
export class FinancePanelComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
