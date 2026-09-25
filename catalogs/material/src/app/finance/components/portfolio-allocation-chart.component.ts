import { Component, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';
import { AllocationPoint } from '../finance.types';
import { VegaChartComponent } from '../shared/vega-chart.component';
@Component({
  selector: 'finance-portfolio-allocation-chart',
  standalone: true,
  imports: [VegaChartComponent],
  template:
    '<finance-vega-chart [spec]="chartSpec" ariaLabel="Portfolio allocation"></finance-vega-chart>',
})
export class PortfolioAllocationChartComponent {
  @Input({ required: true }) data: AllocationPoint[] = [];
  get chartSpec(): VisualizationSpec {
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 280,
      data: { values: this.data },
      mark: { type: 'arc', innerRadius: 65 },
      encoding: {
        theta: { field: 'value', type: 'quantitative', stack: true },
        color: { field: 'category', type: 'nominal', legend: { title: null } },
        tooltip: [
          { field: 'category', title: 'Asset class' },
          { field: 'value', type: 'quantitative', format: ',.1f', title: 'Allocation (%)' },
        ],
      },
      config: { view: { stroke: null } },
    };
  }
}
