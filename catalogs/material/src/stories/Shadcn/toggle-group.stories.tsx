import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Single" | "Multiple"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Toggle Group",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Toggle Group examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/toggle-group",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Single","Multiple"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Single",
  },
  render: (args) => <ComponentDemo component="toggle-group" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    state: "Single",
  },
}

export const Multiple: Story = {
  args: {
    state: "Multiple",
  },
}
