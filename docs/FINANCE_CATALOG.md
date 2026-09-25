# Finance Storybook catalog

## What we built

The existing finance prototype is now a reusable financial analytics catalog inside the **existing Angular Material Storybook**. It has three levels: foundations, financial composites, and the Executive Dashboard template. The dashboard imports its child components and accepts configuration; it no longer embeds demo datasets or chart implementations.

This repository currently contains one catalog project, `catalogs/material`. Finance lives in `src/app/finance`; this is Angular, not React or ShadCN. No healthcare, exporter, Composer, MCP, backend, or authentication implementation was changed. No dependencies or lockfiles were added or changed.

Installed versions verified locally: Angular Core **22.1.6**, Angular Material **22.1.6**, Storybook Angular **10.6.0**, Vega **6.4.0**, Vega-Lite **6.4.3**, vega-embed **7.2.0**. Package manager: npm **11.19.0**; Node **24.20.0**.

## Component inventory and origins

All paths below are relative to `catalogs/material`.

| Level / component | Source | Actual origin and responsibility |
| --- | --- | --- |
| Foundation: FinancePanel | `src/app/finance/shared/finance-panel.component.ts` | Team-written styled wrapper importing `MatCardModule` from `@angular/material/card`. Heading, subtitle, projected content and consistent surface. |
| Composite: MetricCard | `src/app/finance/components/metric-card.component.ts` | Team-written KPI composition importing Material Card and our shared formatter. Supports numeric or legacy string values, currency/percent/number/compact formatting, subtitle, optional text icon, change and independent favorability. |
| Composite: Performance Chart | `src/app/finance/components/price-trend-chart.component.ts` | The existing `PriceTrendChartComponent`, extended rather than duplicated. Builds Vega-Lite specifications, accepts one or two series, line/grouped-bar mode, visible title, currency/locale, zero baseline and empty data. Includes an expandable data table. |
| Shared chart renderer: VegaChart | `src/app/finance/shared/vega-chart.component.ts` | Team-written Angular lifecycle wrapper around external `vega-embed`. SVG rendering, resize observation, cleanup, stale-render protection, error fallback and identical-spec deduplication. Not a custom chart engine. |
| Composite: TransactionTable | `src/app/finance/components/transaction-table.component.ts` and `.scss` | Team-written semantic HTML table, native search/select/buttons and Angular DatePipe. Local search, status filter and sortable columns. No Material Table dependency. |
| Composite: FinancialSummary | `src/app/finance/components/financial-summary.component.ts` | Team-written composition importing FinancePanel and MetricCard. Revenue, expenses, derived profit/margin, optional expense budget and accessible native meter. |
| Template: Executive Dashboard | `src/app/finance/components/finance-dashboard.component.ts`, `.html`, `.scss` | Existing `FinanceDashboardComponent` refactored into a typed, responsive composition. Reporting-period selection, event output, loading, error and empty states. |
| Retained financial charts | `src/app/finance/components/{pnl,portfolio-allocation,candlestick,risk-return}-chart.component.ts` | Existing team-written Vega-Lite specification builders using the same VegaChart renderer. Their chart implementations are retained. |

Material's buttons, inputs, icons, typography and other primitives remain documented in the existing **Material** sidebar. We did not duplicate that catalog or claim that native HTML controls are Material components. KPI icons here are optional decorative text glyphs, not an icon-library integration.

### Verified dependency chain

```text
Finance stories (src/stories/finance/*.stories.ts)
  ├── finance.fixtures.ts → typed synthetic configurations
  └── FinanceDashboardComponent (Executive Dashboard)
        ├── MetricCardComponent
        │     ├── @angular/material/card → MatCard
        │     └── format-value.ts → browser Intl.NumberFormat
        ├── FinancePanelComponent → @angular/material/card → MatCard
        ├── PriceTrendChartComponent
        │     ├── format-value.ts
        │     └── VegaChartComponent
        │           └── vega-embed → Vega-Lite compiler + Vega runtime → SVG
        ├── FinancialSummaryComponent
        │     ├── FinancePanelComponent
        │     ├── MetricCardComponent
        │     └── format-value.ts + native HTML meter
        └── TransactionTableComponent
              ├── semantic HTML table / input / select / buttons
              ├── @angular/common → DatePipe (UTC dates)
              └── format-value.ts
```

The dashboard imports all five local components directly from `./metric-card.component`, `./price-trend-chart.component`, `./transaction-table.component`, `./financial-summary.component`, and `../shared/finance-panel.component`. Child components do not import demo fixtures.

Styles originate in the existing `src/styles.scss` Angular Material `mat.theme()` setup (azure/blue palettes, Material system tokens, light color scheme), plus scoped finance component styles. Finance surfaces, borders and text use Material tokens with fallbacks. Semantic change/status colors and chart series use a small fixed palette. Finance typography uses system-ui; there are no new font requests. The catalog currently targets its existing **light theme**; a complete dark finance palette is not provided or claimed.

## Typed reusability and data

`src/app/finance/finance.types.ts` defines `ExecutiveDashboardConfig`, `ReportingPeriod`, `MetricData`, `TransactionData`, `FinancialSummaryData` and the retained chart contracts.

```ts
interface ExecutiveDashboardConfig {
  title: string;
  subtitle?: string;
  currency?: string; // defaults to USD
  locale?: string;   // defaults to en-US; numeric formatting
  periods: ReportingPeriod[];
  sourceNote?: string;
}
```

Each reporting period has a unique ID, label, optional comparison label, metrics, chart data, transactions and optional summary. The dashboard takes `config`, `initialPeriodId`, `loading`, and `error` inputs and emits `periodChange`. An unknown initial ID falls back to the first available period; changing configuration resets to a valid initial period.

- Select a period to update the entire dashboard. No network request is made.
- The existing `TimeSeriesPoint` keeps `value` and optional `benchmark`. In the executive dashboard these map to Revenue and Expenses through configurable series labels.
- Numeric percentages use ratios: `0.317` renders as `31.7%`. Margin changes are explicitly **percentage points**, not percent growth.
- A positive numeric expense change can have `state: 'negative'`: direction and favorability are separate. Screen-reader text includes favorable/unfavorable.
- Currency values are not converted: `currency` and `locale` only format the supplied numbers. Valid ISO currency codes, locales and ISO date strings are expected.
- Transaction IDs must be unique. Amounts are signed: positive inflow, negative outflow.
- Sorting/filtering never mutates the supplied transaction array. Filters reset when new transaction inputs arrive.
- FinancialSummary derives profit and margin only from its inputs; revenue of zero displays an unavailable margin.
- Error and loading are presentation inputs controlled by the caller. The error story has no fake retry button.

Demo data lives only in `src/app/finance/data/finance.fixtures.ts` and story-specific fixtures. The shared factory generates monthly ledger aggregates and derives all dashboard totals. Completed entries reconcile to chart totals and summary values; pending/failed entries are excluded and explicitly labeled in the source note.

Default Q2: revenue **$1,340,000**, expenses **$915,000**, profit **$425,000**, margin **31.7%**. Q1, strong growth and expense pressure are alternative datasets. They all use the same component implementations.

## Storybook organization

- **Finance / Overview**: architecture and catalog orientation.
- **Finance / Foundations / Panel**: Default.
- **Finance / Components / Metric Card**: Revenue, Operating Profit, Expense Increase, Margin, Absolute Change, Neutral, Large Value, Euro Formatting.
- **Finance / Components / Performance Chart**: Basic, With Benchmark, Volatile Period, Revenue And Expenses, Grouped Bars, Empty.
- **Finance / Components / Transaction Table**: Recent Activity, Empty, Long Description.
- **Finance / Components / Financial Summary**: Within Budget, Over Budget, Empty, Zero Revenue.
- Existing **Candlestick**, **Portfolio Allocation**, **Profit and Loss**, and **Risk vs Return**: two stories each, retained under Components.
- **Finance / Templates / Executive Dashboard**: Default Financial Overview, Strong Growth Scenario, Expense Pressure Scenario, Empty State, Empty Reporting Period, Loading State, Error State.

These are **37 runnable finance stories**, plus the overview and generated component documentation. Input controls are restricted to relevant inputs for the main composites and template.

Story discovery is configured in the unchanged `.storybook/main.ts`: `../src/**/*.mdx` and `../src/**/*.stories.@(js|jsx|mjs|ts|tsx)`. Stories use the existing CSF `Meta`/`StoryObj` convention and `@storybook/angular` renderer. The Angular builder in `angular.json` runs Compodoc; `.storybook/preview.ts` loads `documentation.json` for autogenerated documentation. Addons are Docs and Accessibility. The Angular starter application remains separate; `npm start` does not launch the finance dashboard.

## How to run

From the repository root:

```powershell
cd catalogs/material
npm ci
npm run storybook
```

`npm ci` is needed on a fresh checkout or after dependency changes, not for every demo. Open the URL printed by Storybook, normally http://localhost:6006.

If 6006 is occupied:

```powershell
npm run storybook -- --port 6007
```

Open **Finance → Templates → Executive Dashboard → Default Financial Overview**. Direct URL on the default port:

`http://localhost:6006/?path=/story/finance-templates-executive-dashboard--default-financial-overview`

Validation commands, from `catalogs/material`:

```powershell
npm run build
npm run build-storybook
npx tsc --noEmit -p .storybook/tsconfig.json
npm test -- --watch=false
```

The project has no separate typecheck or end-to-end script. Static Storybook output goes to ignored `storybook-static/`; Compodoc output is also ignored. Do not commit generated output.

## Validation and limitations

Validation completed on September 25, 2026:

| Check | Result |
| --- | --- |
| Production Angular build | Passed |
| Static Storybook build | Passed |
| TypeScript using Storybook's tsconfig | Passed |
| Angular/Vitest suite | 9 tests passed across 2 files: 7 finance tests and 2 existing app tests |
| Generated Storybook index | 37 finance stories and 11 finance documentation entries |
| Git whitespace check | Passed |
| Desktop and narrow browser inspection | Dashboard checked at 1440px and 390px; chart and long-description table also checked at 390px |
| Dashboard Accessibility addon | 0 violations, 36 passes, 1 inconclusive color-contrast check requiring manual review |

The automated finance suite covers fixture reconciliation and dates, numeric formatting, zero changes and favorability, filtering/numeric sorting without mutation, DOM period switching and event emission, loading/error presentation, zero-revenue margins and chart dataset regeneration. Vega is mocked in unit tests because jsdom has no real SVG layout; chart rendering is checked in the browser.

Browser validation covers all seven dashboard scenarios, desktop and narrow layouts, chart rendering/resize, reporting-period changes, KPI value/currency Controls, compact large values, transaction search/status filtering/numeric sorting, long descriptions, and grouped bars. UTC month labels and fixture dates were corrected after visual inspection. Mobile document width stayed within the viewport; only the table's own region scrolls horizontally. One transient MutationObserver console error appeared during rapid Storybook manager navigation; rendered scenarios continued working. No origin was established for that navigation error. Accessibility scanning is helpful but is not equivalent to a complete assistive-technology audit.

Known limits: local in-memory data; two time-series fields; no pagination or virtualization for very large ledgers; fixed English transaction-date labels and monthly chart-axis labels; existing light theme; representative scenarios rather than accounting software. Specialized retained charts still use their original formatting and empty-data behavior.

The original baseline build exposed Windows sandbox ancestor-directory access failures. Builds work with the necessary local build access; no project configuration was changed to work around that. Storybook emits asset/entrypoint size advisories and Compodoc reports absent optional documentation files. Those are non-blocking; baseline Compodoc also reported the optional-file messages. The baseline build did not reach bundling, so no before/after bundle-size claim is made.

## Changed file inventory

Implementation, data and tests:

- `src/app/finance/finance.types.ts`: extended typed contracts.
- `src/app/finance/finance.spec.ts`: seven finance tests.
- `src/app/finance/data/finance.fixtures.ts`: shared synthetic scenarios and reconciled ledger factory.
- `src/app/finance/shared/format-value.ts`: shared numeric formatting.
- `src/app/finance/shared/finance-panel.component.ts`: Material Card wrapper.
- `src/app/finance/shared/vega-chart.component.ts`: resize, deduplication, race cleanup and error handling.
- `src/app/finance/components/metric-card.component.ts`: typed KPI composition and visual polish.
- `src/app/finance/components/price-trend-chart.component.ts`: configurable performance chart, UTC axis, accessible table and empty state.
- `src/app/finance/components/transaction-table.component.ts` and `.scss`: interactive financial table.
- `src/app/finance/components/financial-summary.component.ts`: summary composition and budget.
- `src/app/finance/components/finance-dashboard.component.ts`, `.html`, `.scss`: configuration and responsive composition.

Stories:

- `src/stories/finance/dashboard.stories.ts`: seven dashboard scenarios.
- `src/stories/finance/metric-card.stories.ts`: eight KPI configurations.
- `src/stories/finance/price-trend.stories.ts`: six performance-chart configurations.
- `src/stories/finance/transaction-table.stories.ts`: activity, empty and long-description data.
- `src/stories/finance/financial-summary.stories.ts`: normal, over-budget, empty and zero-revenue states.
- `src/stories/finance/panel.stories.ts`: independent foundational wrapper.
- `src/stories/finance/overview.mdx`: catalog orientation.
- `src/stories/finance/candlestick.stories.ts`, `pnl.stories.ts`, `portfolio-allocation.stories.ts`, `risk-return.stories.ts`: only sidebar titles changed to Components.

Repository documentation: `docs/FINANCE_CATALOG.md` (this file). The pre-existing uncommitted Material form-field and sidenav story changes were preserved.

## Two-to-three-minute meeting walkthrough

> This finance catalog demonstrates how reusable UI components can grow into a useful domain-specific interface. It is built inside our existing Angular Storybook, so we are using one compatible rendering framework throughout.
>
> There are three levels. At the foundation level, Angular Material supplies cards and theme tokens, and our FinancePanel adds a consistent heading and content surface. At the next level, we have our own finance-specific KPI card, performance chart, transaction table and financial summary. At the highest level, the Executive Dashboard imports and composes those components.
>
> The dashboard is therefore a higher-level composition: it coordinates smaller reusable components into a complete financial workflow. It does not duplicate their implementations. This is what we mean by higher-order components here, rather than the formal React higher-order-component pattern.
>
> We developed the finance contracts, formatting, layouts, interactions and synthetic scenarios. Angular Material provides the card underneath our KPI and panel. Vega-Lite defines the charts, while vega-embed and Vega render them. The table is our own semantic HTML component.
>
> The same dashboard can display different businesses or reporting periods through a typed configuration. Switching from Q2 to Q1 updates the metrics, chart, summary and transactions together. Growth and expense-pressure stories pass different data to that same implementation. An expense increase is explicitly unfavorable even though its numeric change is positive.
>
> The fixtures are internally consistent: completed ledger entries reconcile with revenue, expenses and profit, and the margin comes from those totals. All data is clearly illustrative.
>
> Storybook lets us demonstrate each component independently, change its inputs, and inspect empty, loading and error states without building a backend. The dashboard also supports transaction search, status filtering and sorting, and adapts to smaller screens.
>
> This gives our eventual A2UI work a clearer starting point: named components, typed properties and a visible composition hierarchy. It does not yet export usable A2UI components. The export team still needs to define the mapping and registration process.

## Short demo sequence

1. Open **Finance / Overview** and explain the three levels.
2. Open **Components / Metric Card / Revenue**. Change the numeric value and currency in Controls; compare **Expense Increase**, **Margin**, and **Large Value**.
3. Open **Components / Performance Chart / Revenue And Expenses**. Show the two series and **View chart data**. Switch to **Grouped Bars**.
4. Open **Templates / Executive Dashboard / Default Financial Overview**. Hide the addon panel for a larger canvas.
5. Select Q1, then Q2. Point out that every component receives the selected period's data.
6. Search for payroll. Clear search, filter Pending, then return to All statuses. Sort Amount twice.
7. Compare **Strong Growth Scenario** and **Expense Pressure Scenario**; show the over-budget summary. Briefly show Empty, Loading and Error states.
8. Close with the dependency map above and the future A2UI boundary.

## Five likely project-manager questions

**1. Which components did we actually build?**
The finance KPI, chart-specification components, transaction table, summary and dashboard are team-owned. FinancePanel is intentionally a thin styled Material Card wrapper. Angular Material and Vega supply the underlying card/theme and visualization machinery.

**2. Why is the dashboard a higher-level component?**
It imports existing components and coordinates them with one typed configuration and reporting-period selection. Its chart and table logic remain in reusable children.

**3. Can the same dashboard serve a different dataset?**
Yes. Supply another `ExecutiveDashboardConfig` with period metrics, chart rows, transactions and summary. The growth and expense-pressure stories demonstrate this. Currency settings format values; they do not perform currency conversion.

**4. Is this live financial data, and how do we know it is consistent?**
No. It is labeled synthetic data. The fixture factory derives totals from the same monthly values, and automated tests reconcile completed ledger entries, chart series, KPI values and summary values. Pending/failed entries are excluded.

**5. Can A2UI Composer use this directly now?**
No. This work provides clean components and contracts. Export metadata, protocol transformations, rendering mappings and Composer registration remain separate future work owned by the export/integration effort.

## Next steps

Review the demo with the project manager, then prioritize feedback. A later iteration could add pagination, a complete dark palette, additional currencies/localized dates, and automated browser regression coverage. Coordinate typed contract mapping with the export team; do not treat Storybook's generated index as a complete A2UI component definition.
