import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

export type LabResultStatus = 'within-range' | 'high' | 'low' | 'pending';

export interface LabResult {
  id: string;
  name: string;
  value: number | null;
  unit: string;
  referenceRange: string;
  // Supplied by the record; this display component does not interpret results.
  status: LabResultStatus;
}

@Component({
  selector: 'app-lab-results-summary',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressBarModule],
  templateUrl: './lab-results-summary.component.html',
  styleUrls: ['./lab-results-summary.component.scss'],
})
export class LabResultsSummaryComponent {
  @Input() title = 'Lab results';
  @Input() collectedOn = '';
  @Input() results: LabResult[] = [];
  @Input() state: 'ready' | 'loading' | 'error' = 'ready';
  @Input() errorMessage = 'We could not load your results. Please try again.';
  @Input() showViewReport = true;
  @Output() viewReport = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  readonly statusLabels: Record<LabResultStatus, string> = {
    'within-range': 'Within reference range',
    high: 'High',
    low: 'Low',
    pending: 'Pending',
  };

  get availableCount(): number {
    return this.results.filter(result => result.status !== 'pending' && result.value !== null).length;
  }

  get flaggedCount(): number {
    return this.results.filter(result => result.value !== null && (result.status === 'high' || result.status === 'low')).length;
  }

  get pendingCount(): number {
    return this.results.filter(result => result.status === 'pending').length;
  }

  trackResult(_index: number, result: LabResult): string {
    return result.id;
  }
}
