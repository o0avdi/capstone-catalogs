import { Component } from '@angular/core';
import { CatalogComponent } from '@a2ui/angular/v0_9';
import { MetricCardComponent } from '../app/finance/components/metric-card.component';
import { MetricCardAdapterApi } from '../contracts';

@Component({
  selector: 'export-metric-card',
  standalone: true,
  imports: [MetricCardComponent],
  template: ` <finance-metric-card
    [label]="props().label.value()"
    [value]="props().value.value()"
    [format]="props().format?.value() ?? defaults.format"
    [currency]="props().currency?.value() ?? defaults.currency"
    [locale]="props().locale?.value() ?? defaults.locale"
    [subtitle]="props().subtitle?.value()"
    [change]="props().change?.value()"
    [changeFormat]="props().changeFormat?.value() ?? defaults.changeFormat"
    [helper]="props().helper?.value()"
    [icon]="props().icon?.value()"
    [state]="props().state?.value() ?? defaults.state"
  />`,
})
export class MetricCardAdapter extends CatalogComponent<typeof MetricCardAdapterApi> {
  readonly defaults = new MetricCardComponent();
}
