import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Destructive" | "WithAction"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Alert",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Alert examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/alert",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Destructive","WithAction"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="alert" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Destructive: Story = {
  args: {
    state: "Destructive",
  },
}

export const WithAction: Story = {
  args: {
    state: "WithAction",
  },
}
