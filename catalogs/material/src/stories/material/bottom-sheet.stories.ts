import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from 'storybook/test';

@Component({
  selector: 'app-bottom-sheet-demo',
  standalone: true,
  imports: [MatBottomSheetModule, MatButtonModule],
  template: `
    <button matButton="filled" type="button" (click)="open()">
      {{ buttonLabel }}
    </button>

    <ng-template #sheetContent>
      <section style="padding: 16px; max-width: 560px;">
        <h2>{{ heading }}</h2>
        <p style="white-space: pre-line;">{{ description }}</p>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button
            matButton="filled"
            type="button"
            (click)="close('confirm')"
          >
            {{ actionLabel }}
          </button>

          <button matButton="text" type="button" (click)="close()">
            Cancel
          </button>
        </div>
      </section>
    </ng-template>
  `,
})
class BottomSheetDemoComponent implements OnDestroy {
  @Input() buttonLabel = 'Open bottom sheet';
  @Input() heading = 'Export transactions';
  @Input() description = 'Download your transactions as a CSV file.';
  @Input() actionLabel = 'Download CSV';

  @Output() actionSelected = new EventEmitter<string>();

  @ViewChild('sheetContent', { static: true })
  sheetContent!: TemplateRef<unknown>;

  private readonly bottomSheet = inject(MatBottomSheet);
  private sheetRef?: MatBottomSheetRef<unknown, string>;

  open(): void {
    this.sheetRef = this.bottomSheet.open(this.sheetContent, {
      ariaLabel: this.heading,
      restoreFocus: true,
    });

    this.sheetRef.afterDismissed().subscribe((result) => {
      if (result !== undefined) {
        this.actionSelected.emit(result);
      }
    });
  }

  close(result?: string): void {
    this.sheetRef?.dismiss(result);
  }

  ngOnDestroy(): void {
    this.sheetRef?.dismiss();
  }
}

const meta = {
  title: 'Material/Bottom Sheet',
  component: BottomSheetDemoComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An example launcher using MatBottomSheet. Text controls belong ' +
          'to this demo. Confirming logs an action; no file is downloaded.',
      },
    },
  },
  argTypes: {
    buttonLabel: { control: 'text' },
    heading: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text' },
    actionSelected: {
      control: false,
      description: 'Emits "confirm" when the primary action is selected.',
    },
  },
  args: {
    buttonLabel: 'Open bottom sheet',
    heading: 'Export transactions',
    description: 'Download your transactions as a CSV file.',
    actionLabel: 'Download CSV',
    actionSelected: fn(),
  },
} satisfies Meta<BottomSheetDemoComponent>;

export default meta;
type Story = StoryObj<BottomSheetDemoComponent>;

export const Basic: Story = {};

export const LongContent: Story = {
  args: {
    heading: 'Export your monthly financial activity',
    description:
      'Your export includes transaction dates, merchant names, categories, ' +
      'and amounts for the selected period.\n\n' +
      'Pending transactions may change before they are finalized. ' +
      'Transfers between your own accounts are included so you can ' +
      'reconcile the export against your statements.',
  },
};

export const CustomAction: Story = {
  args: {
    buttonLabel: 'Show sharing options',
    heading: 'Share this report',
    description: 'Create a shareable link to your monthly summary.',
    actionLabel: 'Create link',
  },
};