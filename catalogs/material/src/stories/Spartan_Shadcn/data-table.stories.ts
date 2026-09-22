import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { useArgs } from 'storybook/preview-api';

type Payment = { status: string; email: string; amount: number };
type DataTableArgs = { filter: string; rows: Payment[] };

const meta: Meta<DataTableArgs> = {
	title: 'Spartan/Data Table',
	tags: ['autodocs'],
	decorators: [moduleMetadata({ imports: [...HlmInputImports, ...HlmTableImports] })],
	parameters: { layout: 'padded' },
	argTypes: {
		filter: { control: 'text', description: 'Filters rows by email address.' },
		rows: { control: 'object', description: 'Rows rendered in the table.' },
	},
	args: {
		filter: '',
		rows: [
			{ status: 'Success', email: 'ken99@example.com', amount: 316 },
			{ status: 'Success', email: 'abe45@example.com', amount: 242 },
			{ status: 'Processing', email: 'monserrat44@example.com', amount: 837 },
			{ status: 'Failed', email: 'carmella@example.com', amount: 721 },
		],
	},
	render: function Render(args) {
		const [, updateArgs] = useArgs<DataTableArgs>();
		const filteredRows = args.rows.filter((row) => row.email.toLowerCase().includes(args.filter.toLowerCase()));
		return {
			props: {
				...args,
				filteredRows,
				handleFilter: (filter: string) => updateArgs({ filter }),
			},
			template: `
				<div class="w-full max-w-3xl space-y-4">
					<input #filterInput hlmInput class="max-w-sm" placeholder="Filter emails..." [value]="filter"
						(input)="handleFilter(filterInput.value)" />
					<div hlmTableContainer>
						<table hlmTable>
							<thead hlmTHead><tr hlmTr><th hlmTh>Status</th><th hlmTh>Email</th><th hlmTh class="text-right">Amount</th></tr></thead>
							<tbody hlmTBody>
								@for (row of filteredRows; track row.email) {
									<tr hlmTr><td hlmTd>{{ row.status }}</td><td hlmTd>{{ row.email }}</td><td hlmTd class="text-right">{{ row.amount | currency }}</td></tr>
								} @empty {
									<tr hlmTr><td hlmTd colspan="3" class="h-24 text-center">No results.</td></tr>
								}
							</tbody>
						</table>
					</div>
				</div>
			`,
		};
	},
};

export default meta;
type Story = StoryObj<DataTableArgs>;

export const Basic: Story = {};
export const NoMatches: Story = { args: { filter: 'missing' } };
