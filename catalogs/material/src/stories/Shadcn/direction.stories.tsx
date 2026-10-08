import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "LTR" | "RTL"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Direction",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Direction examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/direction",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["LTR","RTL"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "LTR",
  },
  render: (args) => <ComponentDemo component="direction" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const LTR: Story = {
  args: {
    state: "LTR",
  },
}

export const RTL: Story = {
  args: {
    state: "RTL",
  },
}
