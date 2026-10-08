import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Outline" | "Disabled"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Item",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Item examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/item",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Outline","Disabled"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="item" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Outline: Story = {
  args: {
    state: "Outline",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}
