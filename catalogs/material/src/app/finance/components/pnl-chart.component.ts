import { Component, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';
import { PnlPoint } from '../finance.types';
import { VegaChartComponent } from '../shared/vega-chart.component';
@Component({
  selector: 'finance-pnl-chart',
  standalone: true,
  imports: [VegaChartComponent],
  template:
    '<finance-vega-chart [spec]="chartSpec" ariaLabel="Profit and loss by period"></finance-vega-chart>',
})
export class PnlChartComponent {
  @Input({ required: true }) data: PnlPoint[] = [];
  get chartSpec(): VisualizationSpec {
    const values = this.data.flatMap((p) => [
      { period: p.period, type: 'Revenue', amount: p.revenue },
      { period: p.period, type: 'Expenses', amount: p.expenses },
    ]);
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 280,
      data: { values },
      mark: { type: 'bar', cornerRadiusTopLeft: 3, cornerRadiusTopRight: 3 },
      encoding: {
        x: { field: 'period', type: 'ordinal', title: null },
        xOffset: { field: 'type' },
        y: { field: 'amount', type: 'quantitative', title: 'Amount' },
        color: { field: 'type', type: 'nominal', scale: { range: ['#2563eb', '#f59e0b'] } },
        tooltip: [
          { field: 'period', title: 'Period' },
          { field: 'type', title: 'Type' },
          { field: 'amount', type: 'quantitative', format: '$,.0f', title: 'Amount' },
        ],
      },
      config: { view: { stroke: null } },
    };
  }
}
