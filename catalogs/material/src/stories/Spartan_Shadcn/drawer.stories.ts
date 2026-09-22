import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDrawerImports } from '@spartan-ng/helm/drawer';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

type DrawerArgs = {
	triggerLabel: string;
	title: string;
	description: string;
	name: string;
	username: string;
};

const meta: Meta<DrawerArgs> = {
	title: 'Spartan/Drawer',
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [...HlmDrawerImports, ...HlmButtonImports, ...HlmFieldImports, ...HlmInputImports],
		}),
	],
	parameters: { layout: 'centered' },
	argTypes: {
		triggerLabel: { control: 'text' },
		title: { control: 'text' },
		description: { control: 'text' },
		name: { control: 'text' },
		username: { control: 'text' },
	},
	args: {
		triggerLabel: 'Open drawer',
		title: 'Edit profile',
		description: "Make changes to your profile, then select Save changes.",
		name: 'Pedro Duarte',
		username: 'peduarte',
	},
	render: (args) => ({
		props: args,
		template: `
			<hlm-drawer>
				<button hlmDrawerTrigger hlmBtn variant="outline">{{ triggerLabel }}</button>
				<hlm-drawer-content *hlmDrawerPortal="let context">
					<hlm-drawer-header>
						<h3 hlmDrawerTitle>{{ title }}</h3>
						<p hlmDrawerDescription>{{ description }}</p>
					</hlm-drawer-header>
					<hlm-field-group class="px-4">
						<hlm-field>
							<label hlmFieldLabel for="drawer-name">Name</label>
							<input hlmInput id="drawer-name" [value]="name" />
						</hlm-field>
						<hlm-field>
							<label hlmFieldLabel for="drawer-username">Username</label>
							<input hlmInput id="drawer-username" [value]="username" />
						</hlm-field>
					</hlm-field-group>
					<hlm-drawer-footer>
						<button hlmBtn>Save changes</button>
						<button hlmDrawerClose hlmBtn variant="outline">Cancel</button>
					</hlm-drawer-footer>
				</hlm-drawer-content>
			</hlm-drawer>
		`,
	}),
};

export default meta;
type Story = StoryObj<DrawerArgs>;

export const Basic: Story = {};

export const AccountSettings: Story = {
	args: {
		triggerLabel: 'Account settings',
		title: 'Account settings',
		description: 'Update the public information associated with your account.',
	},
};
