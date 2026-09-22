import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { HlmAspectRatioImports } from '@spartan-ng/helm/aspect-ratio';

type AspectRatioArgs = {
  ratio: number;
  width: number;
  title: string;
  description: string;
  rounded: boolean;
};

const meta: Meta<AspectRatioArgs> = {
  title: 'Spartan/Aspect Ratio',
  tags: ['autodocs'],

  decorators: [
    moduleMetadata({
      imports: [...HlmAspectRatioImports],
    }),
  ],

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    ratio: {
      control: {
        type: 'number',
        min: 0.25,
        max: 4,
        step: 0.01,
      },
      description:
        'Width-to-height ratio. For example, 16 / 9 produces a widescreen container.',
    },

    width: {
      control: {
        type: 'range',
        min: 200,
        max: 800,
        step: 10,
      },
      description: 'Width of the example container in pixels.',
    },

    title: {
      control: 'text',
      description: 'Heading displayed inside the example content.',
    },

    description: {
      control: 'text',
      description: 'Supporting text displayed inside the example content.',
    },

    rounded: {
      control: 'boolean',
      description: 'Adds rounded corners to the container.',
    },
  },

  args: {
    ratio: 16 / 9,
    width: 480,
    title: 'Mountain landscape',
    description: '16:9 aspect ratio',
    rounded: true,
  },

  render: (args) => ({
    props: {
      ...args,
    },

    template: `
      <div
        class="w-full"
        [style.width.px]="width"
        style="max-width: 90vw;"
      >
        <div
          [hlmAspectRatio]="ratio"
          class="overflow-hidden border bg-muted"
          [class.rounded-xl]="rounded"
        >
          <div
            class="flex h-full w-full items-end bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-6 text-white"
          >
            <div>
              <h3 class="text-xl font-semibold">
                {{ title }}
              </h3>

              <p class="mt-1 text-sm text-white/80">
                {{ description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export default meta;

type Story = StoryObj<AspectRatioArgs>;

export const Widescreen: Story = {};

export const Square: Story = {
  args: {
    ratio: 1,
    width: 400,
    title: 'Square artwork',
    description: '1:1 aspect ratio',
  },
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
    width: 320,
    title: 'Portrait photograph',
    description: '3:4 aspect ratio',
  },
};

export const Classic: Story = {
  args: {
    ratio: 4 / 3,
    width: 480,
    title: 'Classic display',
    description: '4:3 aspect ratio',
  },
};

export const Ultrawide: Story = {
  args: {
    ratio: 21 / 9,
    width: 700,
    title: 'Ultrawide banner',
    description: '21:9 aspect ratio',
  },
};

export const SharpCorners: Story = {
  args: {
    ratio: 16 / 9,
    width: 480,
    title: 'Sharp corners',
    description: 'Rounded corners are disabled',
    rounded: false,
  },
};