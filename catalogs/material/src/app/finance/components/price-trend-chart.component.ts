import { Component, Input } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';
import { TimeSeriesPoint } from '../finance.types';
import { VegaChartComponent } from '../shared/vega-chart.component';
@Component({
  selector: 'finance-price-trend-chart',
  standalone: true,
  imports: [VegaChartComponent],
  template: '<finance-vega-chart [spec]="chartSpec" [ariaLabel]="title"></finance-vega-chart>',
})
export class PriceTrendChartComponent {
  @Input({ required: true }) data: TimeSeriesPoint[] = [];
  @Input() title = 'Price trend';
  get chartSpec(): VisualizationSpec {
    const values = this.data.flatMap((p) => [
      { date: p.date, series: 'Portfolio', value: p.value },
      ...(p.benchmark === undefined
        ? []
        : [{ date: p.date, series: 'Benchmark', value: p.benchmark }]),
    ]);
    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 280,
      data: { values },
      mark: { type: 'line', point: true },
      encoding: {
        x: { field: 'date', type: 'temporal', title: null },
        y: { field: 'value', type: 'quantitative', title: 'Value', scale: { zero: false } },
        color: { field: 'series', type: 'nominal', scale: { range: ['#2563eb', '#94a3b8'] } },
        tooltip: [
          { field: 'date', type: 'temporal', title: 'Date' },
          { field: 'series', title: 'Series' },
          { field: 'value', type: 'quantitative', format: '$,.2f', title: 'Value' },
        ],
      },
      config: { view: { stroke: null }, axis: { labelFont: 'system-ui', titleFont: 'system-ui' } },
    };
  }
}
