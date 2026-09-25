import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import type { LabResult, LabResultStatus } from '../lab-results-summary/lab-results-summary.component';

export interface LabReport {
  id: string;
  title: string;
  collectedOn: string;
  reportedOn?: string;
  laboratory?: string;
  specimen?: string;
  orderedBy?: string;
  results: LabResult[];
  note?: string;
  noteAuthor?: string;
}

@Component({
  selector: 'app-lab-report-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './lab-report-details.component.html',
  styleUrls: ['./lab-report-details.component.scss'],
})
export class LabReportDetailsComponent {
  @Input() report: LabReport | null = null;
  @Input() state: 'ready' | 'loading' | 'error' = 'ready';
  @Input() errorMessage = 'We could not load this report. Please try again.';
  @Input() showClose = true;
  @Output() closeReport = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  readonly statusLabels: Record<LabResultStatus, string> = {
    'within-range': 'Within reference range', high: 'High', low: 'Low', pending: 'Pending',
  };

  get pendingCount(): number {
    return this.report?.results.filter(result => result.status === 'pending').length ?? 0;
  }

  get flaggedCount(): number {
    return this.report?.results.filter(result => result.value !== null && (result.status === 'high' || result.status === 'low')).length ?? 0;
  }

  trackResult(_index: number, result: LabResult): string { return result.id; }
}