import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { tooltip } from '@tanstack/charts/tooltip';
import { HlmChartImports } from '@spartan-ng/helm/chart';

type RevenueRow = { month: string; revenue: number };
type ChartArgs = { ariaLabel: string; height: number; data: RevenueRow[] };

const meta: Meta<ChartArgs> = {
	title: 'Spartan/Chart',
	tags: ['autodocs'],
	decorators: [moduleMetadata({ imports: [...HlmChartImports] })],
	parameters: { layout: 'padded' },
	argTypes: {
		ariaLabel: { control: 'text' },
		height: { control: { type: 'range', min: 180, max: 500, step: 20 } },
		data: { control: 'object' },
	},
	args: {
		ariaLabel: 'Monthly revenue',
		height: 320,
		data: [
			{ month: 'Jan', revenue: 4200 },
			{ month: 'Feb', revenue: 5100 },
			{ month: 'Mar', revenue: 4800 },
			{ month: 'Apr', revenue: 6200 },
			{ month: 'May', revenue: 7100 },
			{ month: 'Jun', revenue: 7600 },
		],
	},
	render: (args) => {
		const definition = defineChart({
			marks: [lineY(args.data, { x: 'month', y: 'revenue' })],
			scales: {
				x: { scale: () => scalePoint<string>().padding(0.4) },
				y: { scale: scaleLinear, nice: true, grid: true },
			},
			tooltip,
		});

		return {
			props: {
				chartOptions: {
					definition,
					ariaLabel: args.ariaLabel,
					height: args.height,
				},
			},
			template: `
				<div class="w-full max-w-3xl rounded-xl border p-4">
					<tanstack-chart hlmChart [options]="chartOptions" />
				</div>
			`,
		};
	},
};

export default meta;
type Story = StoryObj<ChartArgs>;

export const LineChart: Story = {};

export const Compact: Story = { args: { height: 220 } };
