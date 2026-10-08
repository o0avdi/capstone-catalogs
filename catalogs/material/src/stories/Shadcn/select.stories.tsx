import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Disabled"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Select",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Select examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/select",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Disabled"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="select" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}
