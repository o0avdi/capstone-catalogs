import { TestBed } from '@angular/core/testing';
import { FinanceDashboardComponent } from './components/finance-dashboard.component';
import { MetricCardComponent } from './components/metric-card.component';
import { TransactionTableComponent } from './components/transaction-table.component';
import { FinancialSummaryComponent } from './components/financial-summary.component';
import { PriceTrendChartComponent } from './components/price-trend-chart.component';
import { overviewConfig, growthConfig, pressureConfig } from './data/finance.fixtures';
import { formatValue } from './shared/format-value';

// Vega needs real browser layout; chart rendering is validated in Storybook.
vi.mock('vega-embed', () => ({ default: vi.fn() }));

describe('Finance contracts and fixtures', () => {
  it('reconciles every scenario from completed ledger entries through chart, summary and KPIs', () => {
    for (const config of [overviewConfig, growthConfig, pressureConfig]) {
      for (const period of config.periods) {
        const months = period.chartData.map((point) => point.date.slice(0, 7));
        for (const transaction of period.transactions) {
          expect(months).toContain(transaction.date.slice(0, 7));
          expect(new Date(transaction.date).toISOString().slice(0, 10)).toBe(transaction.date);
        }
        const completed = period.transactions.filter((t) => t.status === 'completed');
        const revenue = completed.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const expenses = -completed.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0);
        expect(period.chartData.reduce((s, p) => s + p.value, 0)).toBe(revenue);
        expect(period.chartData.reduce((s, p) => s + (p.benchmark ?? 0), 0)).toBe(expenses);
        expect(period.summary).toMatchObject({ revenue, expenses });
        expect(period.metrics.map((m) => m.value)).toEqual([
          revenue,
          revenue - expenses,
          expenses,
          (revenue - expenses) / revenue,
        ]);
      }
    }
  });
  it('formats currencies, ratios, compact values, zero and nonfinite values', () => {
    expect(formatValue(1234.5, 'currency')).toBe('$1,234.5');
    expect(formatValue(0.317, 'percent')).toBe('31.7%');
    expect(formatValue(123456789012, 'compact')).toBe('123.5B');
    expect(formatValue(0, 'currency')).toBe('$0');
    expect(formatValue(NaN, 'number')).toBe('—');
    expect(formatValue(1234.5, 'currency', 'EUR', 'de-DE')).toContain('1.234,5');
  });
});

describe('Finance components', () => {
  it('renders numeric zero changes and unfavorable expense increases', async () => {
    const fixture = TestBed.createComponent(MetricCardComponent);
    fixture.componentRef.setInput('label', 'Expenses');
    fixture.componentRef.setInput('value', 1000);
    fixture.componentRef.setInput('change', 0);
    fixture.componentRef.setInput('state', 'negative');
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('0%');
    expect(fixture.nativeElement.textContent).toContain('Unfavorable');
    fixture.componentRef.setInput('change', 0.2);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('+20%');
  });
  it('filters, sorts numerically and leaves source transactions intact', async () => {
    const fixture = TestBed.createComponent(TransactionTableComponent);
    const transactions = overviewConfig.periods[0].transactions;
    const ids = transactions.map((t) => t.id);
    fixture.componentRef.setInput('transactions', transactions);
    await fixture.whenStable();
    const component = fixture.componentInstance;
    const search = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    search.value = 'payroll';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.rows.length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
    component.query = '';
    component.status = 'pending';
    expect(component.rows.length).toBe(1);
    component.status = 'all';
    component.sort('amount');
    const amounts = component.rows.map((t) => t.amount);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
    expect(transactions.map((t) => t.id)).toEqual(ids);
    search.value = 'no-match';
    search.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('No transactions match');
  });
  it('updates the entire period through the selector and emits its ID', async () => {
    // Chart rendering is checked in the real browser; avoid requiring SVG layout in jsdom.
    TestBed.overrideComponent(PriceTrendChartComponent, { set: { template: '' } });
    const fixture = TestBed.createComponent(FinanceDashboardComponent);
    fixture.componentRef.setInput('config', overviewConfig);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('$1,340,000');
    const emitted: string[] = [];
    fixture.componentInstance.periodChange.subscribe((id) => emitted.push(id));
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'q1';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(fixture.componentInstance.period?.id).toBe('q1');
    expect(fixture.nativeElement.textContent).toContain('$1,170,000');
    expect(fixture.nativeElement.textContent).not.toContain('$1,340,000');
    expect(emitted).toEqual(['q1']);
    fixture.componentRef.setInput('config', pressureConfig);
    await fixture.whenStable();
    expect(fixture.componentInstance.period?.id).toBe('pressure');
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Loading financial overview');
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('error', 'Dataset unavailable');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Dataset unavailable',
    );
  });
  it('handles zero revenue without an infinite margin', () => {
    const summary = new FinancialSummaryComponent();
    summary.data = { revenue: 0, expenses: 10 };
    expect(summary.margin).toBe('—');
  });
  it('builds updated chart series and preserves a zero comparison value', () => {
    const chart = new PriceTrendChartComponent();
    chart.data = [{ date: '2026-01-01', value: 10, benchmark: 0 }];
    chart.seriesLabel = 'Revenue';
    chart.comparisonLabel = 'Expenses';
    chart.ngOnChanges();
    expect((chart.chartSpec.data as { values: unknown[] }).values).toHaveLength(2);
    chart.data = [];
    chart.ngOnChanges();
    expect((chart.chartSpec.data as { values: unknown[] }).values).toHaveLength(0);
  });
});
