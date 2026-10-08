import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Single" | "Range"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Calendar",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Calendar examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/calendar",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Single","Range"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Single",
  },
  render: (args) => <ComponentDemo component="calendar" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    state: "Single",
  },
}

export const Range: Story = {
  args: {
    state: "Range",
  },
}
