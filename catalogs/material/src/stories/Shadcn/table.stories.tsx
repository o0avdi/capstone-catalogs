import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Striped"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Table",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Table examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/table",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Striped"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="table" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Striped: Story = {
  args: {
    state: "Striped",
  },
}
