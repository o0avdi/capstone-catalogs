import { Component, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';
import { RiskReturnPoint } from '../finance.types';
import { VegaChartComponent } from '../shared/vega-chart.component';
@Component({
  selector: 'finance-risk-return-chart',
  standalone: true,
  imports: [VegaChartComponent],
  template:
    '<finance-vega-chart [spec]="chartSpec" ariaLabel="Risk versus return chart"></finance-vega-chart>',
})
export class RiskReturnChartComponent {
  @Input({ required: true }) data: RiskReturnPoint[] = [];
  get chartSpec(): VisualizationSpec {
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 280,
      data: { values: this.data },
      mark: { type: 'circle', opacity: 0.8 },
      encoding: {
        x: { field: 'volatility', type: 'quantitative', title: 'Volatility (%)' },
        y: { field: 'return', type: 'quantitative', title: 'Return (%)' },
        size: {
          field: 'allocation',
          type: 'quantitative',
          title: 'Allocation (%)',
          scale: { range: [100, 1100] },
        },
        color: { field: 'asset', type: 'nominal', legend: null },
        tooltip: [
          { field: 'asset', title: 'Asset' },
          { field: 'return', type: 'quantitative', format: '.1f', title: 'Return (%)' },
          { field: 'volatility', type: 'quantitative', format: '.1f', title: 'Volatility (%)' },
          { field: 'allocation', type: 'quantitative', format: '.1f', title: 'Allocation (%)' },
        ],
      },
      config: { view: { stroke: null } },
    };
  }
}
