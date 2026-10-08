import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Widescreen" | "Square"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Aspect Ratio",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Aspect Ratio examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/aspect-ratio",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Widescreen","Square"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Widescreen",
  },
  render: (args) => <ComponentDemo component="aspect-ratio" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Widescreen: Story = {
  args: {
    state: "Widescreen",
  },
}

export const Square: Story = {
  args: {
    state: "Square",
  },
}
