import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Selected" | "Disabled" | "ReadOnly"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Switch",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Switch examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/switch",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Selected","Disabled","ReadOnly"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="switch" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Selected: Story = {
  args: {
    state: "Selected",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}

export const ReadOnly: Story = {
  args: {
    state: "ReadOnly",
  },
}
