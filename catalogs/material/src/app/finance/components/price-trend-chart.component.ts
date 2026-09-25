import { Component, Input, OnChanges } from '@angular/core';
import { VisualizationSpec } from 'vega-embed';
import { TimeSeriesPoint, ValueFormat } from '../finance.types';
import { VegaChartComponent } from '../shared/vega-chart.component';
import { formatValue } from '../shared/format-value';

@Component({
  selector: 'finance-price-trend-chart',
  standalone: true,
  imports: [VegaChartComponent],
  template: `@if (showTitle) {
      <h3>{{ title }}</h3>
    }
    @if (data.length) {
      <finance-vega-chart [spec]="chartSpec" [ariaLabel]="title" />
      <details>
        <summary>View chart data</summary>
        <div class="data">
          <table>
            <caption>
              {{
                title
              }}
            </caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>{{ seriesLabel }}</th>
                <th>{{ comparisonLabel }}</th>
              </tr>
            </thead>
            <tbody>
              @for (point of data; track $index) {
                <tr>
                  <td>{{ point.date }}</td>
                  <td>{{ formatAmount(point.value) }}</td>
                  <td>{{ point.benchmark === undefined ? '—' : formatAmount(point.benchmark) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </details>
    } @else {
      <div class="empty" role="status">No performance data for this period.</div>
    }`,
  styles: [
    `
      :host {
        display: block;
        min-width: 0;
      }
      h3 {
        margin: 0 0 20px;
        font: 600 17px/1.4 system-ui;
        color: var(--mat-sys-on-surface);
      }
      .empty {
        min-height: 280px;
        display: grid;
        place-items: center;
        color: var(--mat-sys-on-surface-variant);
        font: 14px system-ui;
        text-align: center;
      }
      details {
        margin-top: 16px;
        font: 12px/1.6 system-ui;
        color: var(--mat-sys-on-surface-variant);
      }
      summary {
        cursor: pointer;
        width: fit-content;
      }
      .data {
        overflow: auto;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 12px;
      }
      th,
      td {
        text-align: left;
        padding: 8px;
        border-bottom: 1px solid var(--mat-sys-outline-variant);
      }
    `,
  ],
})
export class PriceTrendChartComponent implements OnChanges {
  @Input({ required: true }) data: TimeSeriesPoint[] = [];
  @Input() title = 'Price trend';
  @Input() showTitle = true;
  @Input() seriesLabel = 'Portfolio';
  @Input() comparisonLabel = 'Benchmark';
  @Input() format: ValueFormat = 'currency';
  @Input() currency = 'USD';
  @Input() locale = 'en-US';
  @Input() chartType: 'line' | 'bar' = 'line';
  @Input() zeroBaseline = false;
  chartSpec!: VisualizationSpec;

  formatAmount(value: number): string {
    return formatValue(value, this.format, this.currency, this.locale);
  }
  ngOnChanges(): void {
    const values = this.data.flatMap((p) => [
      {
        date: p.date,
        series: this.seriesLabel,
        value: p.value,
        formatted: this.formatAmount(p.value),
      },
      ...(p.benchmark === undefined
        ? []
        : [
            {
              date: p.date,
              series: this.comparisonLabel,
              value: p.benchmark,
              formatted: this.formatAmount(p.benchmark),
            },
          ]),
    ]);
    this.chartSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      width: 'container',
      height: 280,
      background: 'transparent',
      autosize: { type: 'fit', contains: 'padding' },
      data: { values },
      mark:
        this.chartType === 'bar'
          ? { type: 'bar', cornerRadiusTopLeft: 3, cornerRadiusTopRight: 3 }
          : { type: 'line', point: { filled: true, size: 45 }, strokeWidth: 3 },
      encoding: {
        x:
          this.chartType === 'bar'
            ? {
                field: 'date',
                type: 'ordinal',
                sort: null,
                title: null,
                axis: {
                  labelExpr: "utcFormat(toDate(datum.value), '%b')",
                  labelAngle: 0,
                  grid: false,
                },
              }
            : {
                field: 'date',
                type: 'temporal',
                scale: { type: 'utc' },
                title: null,
                axis: {
                  format: '%b',
                  tickCount: Math.min(this.data.length, 6),
                  values:
                    this.data.length <= 6
                      ? this.data.map((point) => Date.parse(point.date))
                      : undefined,
                  labelAngle: 0,
                  grid: false,
                },
              },
        ...(this.chartType === 'bar' ? { xOffset: { field: 'series' } } : {}),
        y: {
          field: 'value',
          type: 'quantitative',
          stack: null,
          title: this.format === 'currency' ? this.currency : 'Value',
          scale: { zero: this.zeroBaseline },
          axis: { format: this.format === 'percent' ? '.0%' : '~s', tickCount: 5 },
        },
        color: {
          field: 'series',
          type: 'nominal',
          scale: {
            domain: [this.seriesLabel, this.comparisonLabel],
            range: ['#24756b', '#b56a32'],
          },
          legend: { title: null, orient: 'top', labelLimit: 160, symbolType: 'circle' },
        },
        tooltip: [
          { field: 'date', type: 'nominal', title: 'Date' },
          { field: 'series', title: 'Series' },
          { field: 'formatted', title: 'Value' },
        ],
      },
      config: {
        view: { stroke: null },
        axis: {
          labelFont: 'system-ui',
          titleFont: 'system-ui',
          labelColor: '#526173',
          titleColor: '#526173',
          gridColor: '#e5eaf0',
          domain: false,
          ticks: false,
          labelPadding: 10,
          titlePadding: 12,
        },
        legend: { labelFont: 'system-ui', labelColor: '#526173', padding: 12 },
      },
    };
  }
}
