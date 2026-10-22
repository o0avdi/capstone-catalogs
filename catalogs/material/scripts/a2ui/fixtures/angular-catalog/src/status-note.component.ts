import { Component, Input } from '@angular/core';

export enum NoteTone {
  Quiet = 'quiet',
  Highlight = 'highlight',
}

/** A compact status note with a source-defined input contract. */
@Component({
  selector: 'fixture-status-note',
  standalone: true,
  template: '<p [hidden]="!visible" [attr.data-tone]="tone">{{ label }}: {{ value }} {{ suffix }}</p>',
})
export class StatusNoteComponent {
  /** Accessible label for the reported value. */
  @Input({ required: true }) label = 'Status';

  /** Numeric or preformatted value, supplied by the caller. */
  @Input({ required: true }) value!: number | string;

  /** Whether the note is visible. */
  @Input() visible = true;

  /** Visual emphasis of the note. */
  @Input() tone: NoteTone = NoteTone.Quiet;

  /** Density requested by the caller. */
  @Input() density: 'compact' | 'comfortable' = 'compact';

  /** Decimal places requested for numeric values. */
  @Input() precision = 2;

  /** Optional unit suffix. */
  @Input() suffix?: string;
}
