import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { LabResultsSummaryComponent } from './lab-results-summary.component';
import type { LabResult } from './lab-results-summary.component';

// Fictional fixtures for UI demonstrations, not clinical reference data.
const withinRangeResults: LabResult[] = [
  { id: 'hemoglobin', name: 'Hemoglobin', value: 14.2, unit: 'g/dL', referenceRange: '12.0–16.0 g/dL', status: 'within-range' },
  { id: 'wbc', name: 'White blood cell count', value: 6.8, unit: '×10⁹/L', referenceRange: '4.0–11.0 ×10⁹/L', status: 'within-range' },
  { id: 'platelets', name: 'Platelet count', value: 250, unit: '×10⁹/L', referenceRange: '150–400 ×10⁹/L', status: 'within-range' },
];

type LabSummaryArgs = {
  title: string;
  collectedOn: string;
  results: LabResult[];
  state: 'ready' | 'loading' | 'error';
  errorMessage: string;
  showViewReport: boolean;
  onViewReport: () => void;
  onRetry: () => void;
};

const meta: Meta<LabSummaryArgs> = {
  title: 'Material/Widgets/Lab Results Summary',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LabResultsSummaryComponent] })],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A Material-based summary of supplied lab results. All examples use fictional data. View report and Retry emit events visible in the Actions panel; navigation and data fetching are handled by a parent.' } },
  },
  argTypes: {
    title: { control: 'text' },
    collectedOn: { control: 'text', description: 'Display-ready collection date.' },
    results: { control: 'object', description: 'Measurements with supplied reference ranges and status flags.' },
    state: { control: 'radio', options: ['ready', 'loading', 'error'] },
    errorMessage: { control: 'text' },
    showViewReport: { control: 'boolean' },
    onViewReport: { control: false, description: 'Emitted when View full report is clicked.' },
    onRetry: { control: false, description: 'Emitted when Retry is clicked.' },
  },
  args: {
    title: 'Complete blood count',
    collectedOn: 'September 24, 2026',
    results: withinRangeResults,
    state: 'ready',
    errorMessage: 'We could not load your results. Please try again.',
    showViewReport: true,
    onViewReport: fn(),
    onRetry: fn(),
  },
  render: args => ({
    props: args,
    template: `
      <app-lab-results-summary
        [title]="title"
        [collectedOn]="collectedOn"
        [results]="results"
        [state]="state"
        [errorMessage]="errorMessage"
        [showViewReport]="showViewReport"
        (viewReport)="onViewReport()"
        (retry)="onRetry()"
      ></app-lab-results-summary>
    `,
  }),
};

export default meta;
type Story = StoryObj<LabSummaryArgs>;

export const AllWithinRange: Story = {};
export const FlaggedResults: Story = {
  args: {
    results: [
      { ...withinRangeResults[0], value: 10.8, status: 'low' },
      { ...withinRangeResults[1], value: 12.4, status: 'high' },
      withinRangeResults[2],
    ],
  },
};
export const PartiallyAvailable: Story = {
  args: { results: [withinRangeResults[0], withinRangeResults[1], { ...withinRangeResults[2], value: null, status: 'pending' }] },
};
export const Loading: Story = { args: { state: 'loading', results: [] } };
export const Empty: Story = { args: { results: [], collectedOn: '' } };
export const Error: Story = { args: { state: 'error', results: [] } };
