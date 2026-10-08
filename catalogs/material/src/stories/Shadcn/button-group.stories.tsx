import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "WithLabel"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Button Group",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Button Group examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/button-group",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","WithLabel"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="button-group" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const WithLabel: Story = {
  args: {
    state: "WithLabel",
  },
}
