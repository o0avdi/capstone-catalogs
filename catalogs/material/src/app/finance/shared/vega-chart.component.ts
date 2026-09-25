import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import embed, { Result, VisualizationSpec } from 'vega-embed';

@Component({
  selector: 'finance-vega-chart',
  standalone: true,
  template: '<div #container class="chart" [attr.aria-label]="ariaLabel" role="img"></div>',
  styles: [
    ':host{display:block;width:100%;min-width:0}.chart{width:100%;min-height:250px;overflow:hidden}.chart :is(svg,canvas){max-width:100%;height:auto}',
  ],
})
export class VegaChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) spec!: VisualizationSpec;
  @Input() ariaLabel = 'Financial data visualization';
  @ViewChild('container') private container?: ElementRef<HTMLDivElement>;
  private result?: Result;
  private initialized = false;
  private renderId = 0;
  private observer?: ResizeObserver;
  private previousSpec = '';

  ngAfterViewInit(): void {
    this.initialized = true;
    if (typeof ResizeObserver !== 'undefined' && this.container) {
      this.observer = new ResizeObserver(() => {
        void this.result?.view.resize().runAsync();
      });
      this.observer.observe(this.container.nativeElement);
    }
    void this.render();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && changes['spec']) void this.render();
  }
  ngOnDestroy(): void {
    this.renderId++;
    this.observer?.disconnect();
    this.dispose();
  }

  private dispose(): void {
    this.result?.finalize();
    this.result = undefined;
  }
  private async render(): Promise<void> {
    const host = this.container?.nativeElement;
    if (!host) return;
    // Existing chart components expose getter specs; do not re-embed identical charts on every change detection.
    const serialized = JSON.stringify(this.spec);
    if (serialized === this.previousSpec) return;
    this.previousSpec = serialized;
    const id = ++this.renderId;
    this.dispose();
    const target = document.createElement('div');
    target.style.width = '100%';
    host.replaceChildren(target);
    try {
      const result = await embed(target, this.spec, {
        actions: false,
        renderer: 'svg',
        tooltip: true,
        defaultStyle: false,
      });
      if (id !== this.renderId) {
        result.finalize();
        return;
      }
      this.result = result;
    } catch {
      if (id === this.renderId) {
        this.previousSpec = '';
        host.textContent = 'The chart could not be displayed.';
      }
    }
  }
}
