import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Horizontal" | "Vertical"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Separator",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Separator examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/separator",
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
  render: (args) => <ComponentDemo component="separator" state={args.state} />,
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
