import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Icon" | "WithAction"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Empty",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Empty examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/empty",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Icon","WithAction"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="empty" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Icon: Story = {
  args: {
    state: "Icon",
  },
}

export const WithAction: Story = {
  args: {
    state: "WithAction",
  },
}
