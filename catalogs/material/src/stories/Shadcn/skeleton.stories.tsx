import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Card"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Skeleton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Skeleton examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/skeleton",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Card"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="skeleton" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Card: Story = {
  args: {
    state: "Card",
  },
}
