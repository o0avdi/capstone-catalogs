import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Filled" | "Invalid" | "Disabled"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Textarea",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Textarea examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/textarea",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Filled","Invalid","Disabled"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="textarea" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Filled: Story = {
  args: {
    state: "Filled",
  },
}

export const Invalid: Story = {
  args: {
    state: "Invalid",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}
