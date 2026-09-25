import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ExecutiveDashboardConfig, ReportingPeriod } from '../finance.types';
import { MetricCardComponent } from './metric-card.component';
import { PriceTrendChartComponent } from './price-trend-chart.component';
import { TransactionTableComponent } from './transaction-table.component';
import { FinancialSummaryComponent } from './financial-summary.component';
import { FinancePanelComponent } from '../shared/finance-panel.component';

@Component({
  selector: 'finance-dashboard',
  standalone: true,
  imports: [
    MetricCardComponent,
    PriceTrendChartComponent,
    TransactionTableComponent,
    FinancialSummaryComponent,
    FinancePanelComponent,
  ],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss'],
})
export class FinanceDashboardComponent implements OnChanges {
  @Input({ required: true }) config: ExecutiveDashboardConfig = {
    title: 'Executive dashboard',
    periods: [],
  };
  @Input() initialPeriodId = '';
  @Input() loading = false;
  @Input() error = '';
  @Output() periodChange = new EventEmitter<string>();
  selectedPeriodId = '';
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['initialPeriodId']) {
      this.selectedPeriodId =
        this.config.periods.find((p) => p.id === this.initialPeriodId)?.id ??
        this.config.periods[0]?.id ??
        '';
    }
  }
  get period(): ReportingPeriod | undefined {
    return this.config.periods.find((p) => p.id === this.selectedPeriodId);
  }
  get currency(): string {
    return this.config.currency ?? 'USD';
  }
  get locale(): string {
    return this.config.locale ?? 'en-US';
  }
  selectPeriod(id: string): void {
    if (!this.config.periods.some((p) => p.id === id)) return;
    this.selectedPeriodId = id;
    this.periodChange.emit(id);
  }
}
