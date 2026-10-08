import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "WithBadge" | "Group"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Avatar",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Avatar examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/avatar",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","WithBadge","Group"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="avatar" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const WithBadge: Story = {
  args: {
    state: "WithBadge",
  },
}

export const Group: Story = {
  args: {
    state: "Group",
  },
}
