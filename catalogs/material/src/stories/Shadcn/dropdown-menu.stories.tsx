import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "DisabledItem"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Dropdown Menu",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Dropdown Menu examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/dropdown-menu",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","DisabledItem"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="dropdown-menu" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const DisabledItem: Story = {
  args: {
    state: "DisabledItem",
  },
}
