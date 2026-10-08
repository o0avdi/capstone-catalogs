import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Vertical" | "Horizontal"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Scroll Area",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Scroll Area examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/scroll-area",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Vertical","Horizontal"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Vertical",
  },
  render: (args) => <ComponentDemo component="scroll-area" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: {
    state: "Vertical",
  },
}

export const Horizontal: Story = {
  args: {
    state: "Horizontal",
  },
}
