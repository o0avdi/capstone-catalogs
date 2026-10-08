import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Checked" | "Indeterminate" | "Disabled"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Checkbox",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Checkbox examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/checkbox",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Checked","Indeterminate","Disabled"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="checkbox" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Checked: Story = {
  args: {
    state: "Checked",
  },
}

export const Indeterminate: Story = {
  args: {
    state: "Indeterminate",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}
