import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { Component, EventEmitter, Input, Output, TemplateRef, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LabResultsSummaryComponent } from '../lab-results-summary/lab-results-summary.component';
import { LabReportDetailsComponent } from './lab-report-details.component';
import type { LabReport } from './lab-report-details.component';

// Fictional UI fixtures. Status and range are supplied, not calculated.
const exampleReport: LabReport = {
  id: 'DEMO-2026-0924',
  title: 'Complete blood count',
  collectedOn: 'September 24, 2026, 9:15 AM',
  reportedOn: 'September 24, 2026, 2:30 PM',
  laboratory: 'Example Laboratory',
  specimen: 'Whole blood',
  orderedBy: 'Example Care Team',
  results: [
    { id: 'hemoglobin', name: 'Hemoglobin', value: 10.8, unit: 'g/dL', referenceRange: '12.0–16.0 g/dL', status: 'low' },
    { id: 'wbc', name: 'White blood cell count', value: 12.4, unit: '×10⁹/L', referenceRange: '4.0–11.0 ×10⁹/L', status: 'high' },
    { id: 'platelets', name: 'Platelet count', value: 250, unit: '×10⁹/L', referenceRange: '150–400 ×10⁹/L', status: 'within-range' },
  ],
  note: 'Demonstration report. Two measurements are flagged outside their supplied reference ranges.\nThis note is supplied with the report; the widget does not generate an interpretation.',
  noteAuthor: 'Example Care Team',
};

type Args = {
  report: LabReport | null;
  state: 'ready' | 'loading' | 'error';
  errorMessage: string;
  showClose: boolean;
  onCloseReport: () => void;
  onRetry: () => void;
};

// Story-only host: keeps dialog orchestration outside both reusable widgets.
@Component({
  selector: 'app-lab-report-flow-demo',
  standalone: true,
  imports: [LabResultsSummaryComponent, LabReportDetailsComponent, MatDialogModule],
  template: `
    <app-lab-results-summary [title]="report.title" [collectedOn]="report.collectedOn"
      [results]="report.results" (viewReport)="open(reportTemplate)">
    </app-lab-results-summary>
    <ng-template #reportTemplate>
      <div style="max-height: 85vh; overflow-y: auto; padding: 4px;">
        <app-lab-report-details [report]="report" (closeReport)="close()"></app-lab-report-details>
      </div>
    </ng-template>
  `,
})
class LabReportFlowDemoComponent {
  @Input() report: LabReport = exampleReport;
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  private readonly dialog = inject(MatDialog);
  private dialogRef?: MatDialogRef<unknown>;

  open(template: TemplateRef<unknown>): void {
    this.dialogRef = this.dialog.open(template, {
      width: '920px', maxWidth: '95vw', maxHeight: '90vh',
      ariaLabel: 'Lab report details', restoreFocus: true,
    });
    this.opened.emit();
    this.dialogRef.afterClosed().subscribe(() => this.closed.emit());
  }

  close(): void { this.dialogRef?.close(); }
}

const meta: Meta<Args> = {
  title: 'Material/Widgets/Lab Report Details',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LabReportDetailsComponent] })],
  parameters: { layout: 'padded' },
  argTypes: {
    report: { control: 'object' },
    state: { control: 'radio', options: ['ready', 'loading', 'error'] },
    errorMessage: { control: 'text' },
    showClose: { control: 'boolean' },
    onCloseReport: { control: false },
    onRetry: { control: false },
  },
  args: { report: exampleReport, state: 'ready', errorMessage: 'We could not load this report. Please try again.', showClose: true, onCloseReport: fn(), onRetry: fn() },
  render: args => ({ props: args, template: `
    <app-lab-report-details [report]="report" [state]="state" [errorMessage]="errorMessage"
      [showClose]="showClose" (closeReport)="onCloseReport()" (retry)="onRetry()">
    </app-lab-report-details>
  ` }),
};
export default meta;
type Story = StoryObj<Args>;
export const FlaggedResults: Story = {};
export const AllWithinRange: Story = {
  args: { report: { ...exampleReport, results: exampleReport.results.map(result => ({ ...result, value: result.id === 'hemoglobin' ? 14.2 : result.id === 'wbc' ? 6.8 : 250, status: 'within-range' })), note: 'Demonstration report. All displayed measurements are within their supplied reference ranges.' } },
};
export const PartiallyAvailable: Story = {
  args: { report: { ...exampleReport, reportedOn: undefined, results: exampleReport.results.map(result => result.id === 'platelets' ? { ...result, value: null, status: 'pending' } : result), note: undefined, noteAuthor: undefined } },
};
export const WithoutNote: Story = { args: { report: { ...exampleReport, note: undefined, noteAuthor: undefined } } };
export const Loading: Story = { args: { state: 'loading', report: null } };
export const Empty: Story = { args: { report: null } };
export const NoMeasurements: Story = { args: { report: { ...exampleReport, results: [], note: undefined, noteAuthor: undefined } } };
export const Error: Story = { args: { state: 'error', report: null } };

export const SummaryToReport: Story = {
  decorators: [moduleMetadata({ imports: [LabReportFlowDemoComponent] })],
  parameters: {
    controls: { include: ['report'] },
    docs: { description: { story: 'Click View full report to open the details dialog. Close report, Escape, or a backdrop click dismisses it. Material manages focus trapping and restores focus to the trigger. Opening and closing are logged in Actions.' } },
  },
  render: args => ({
    props: { report: args.report ?? exampleReport, onOpened: fn(), onClosed: args.onCloseReport },
    template: '<app-lab-report-flow-demo [report]="report" (opened)="onOpened()" (closed)="onClosed()"></app-lab-report-flow-demo>',
  }),
};
