import { HlmAvatar, HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { type Meta, type StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

const meta: Meta<HlmAvatar> = {
	title: 'Spartan/Avatar',
	component: HlmAvatar,
	tags: ['autodocs'],
	decorators: [
		moduleMetadata({
			imports: [HlmAvatarImports],
		}),
	],
	render: ({ ...args }) => ({
		props: { args },
		template: `
    <hlm-avatar ${argsToTemplate(args)}>
      <img src='/avatar.svg' alt='Example profile avatar' hlmAvatarImage>
      <span class='bg-sky-600 text-sky-50' hlmAvatarFallback>MT</span>
    </hlm-avatar>
`,
	}),
};

export default meta;
type Story = StoryObj<HlmAvatar>;

export const Default: Story = {};
