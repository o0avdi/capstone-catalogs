import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "WithAction" | "Compact"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Card",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Card examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/card",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","WithAction","Compact"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="card" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const WithAction: Story = {
  args: {
    state: "WithAction",
  },
}

export const Compact: Story = {
  args: {
    state: "Compact",
  },
}
