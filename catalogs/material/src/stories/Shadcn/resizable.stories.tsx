import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Horizontal" | "Vertical"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Resizable",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Resizable examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/resizable",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Horizontal","Vertical"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Horizontal",
  },
  render: (args) => <ComponentDemo component="resizable" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    state: "Horizontal",
  },
}

export const Vertical: Story = {
  args: {
    state: "Vertical",
  },
}
