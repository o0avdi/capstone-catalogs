import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import embed, { Result, VisualizationSpec } from 'vega-embed';

@Component({
  selector: 'finance-vega-chart', standalone: true,
  template: '<div #container class="chart" [attr.aria-label]="ariaLabel" role="img"></div>',
  styles: [':host{display:block;width:100%}.chart{width:100%;min-height:250px}.chart :is(svg,canvas){max-width:100%;height:auto}']
})
export class VegaChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) spec!: VisualizationSpec;
  @Input() ariaLabel = 'Financial data visualization';
  @ViewChild('container') private container?: ElementRef<HTMLDivElement>;
  private result?: Result;
  private initialized = false;
  private renderId = 0;

  ngAfterViewInit(): void { this.initialized = true; void this.render(); }
  ngOnChanges(changes: SimpleChanges): void { if (this.initialized && changes['spec']) void this.render(); }
  ngOnDestroy(): void { this.renderId++; this.dispose(); }

  private dispose(): void { this.result?.finalize(); this.result = undefined; }
  private async render(): Promise<void> {
    const host = this.container?.nativeElement;
    if (!host) return;
    const id = ++this.renderId;
    this.dispose(); host.replaceChildren();
    const result = await embed(host, this.spec, { actions: false, renderer: 'svg', tooltip: true, defaultStyle: false });
    if (id !== this.renderId) { result.finalize(); return; }
    this.result = result;
  }
}
