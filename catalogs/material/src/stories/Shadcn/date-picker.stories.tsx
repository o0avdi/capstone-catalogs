import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Selected" | "Empty"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Date Picker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Date Picker examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/date-picker",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Selected","Empty"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Selected",
  },
  render: (args) => <ComponentDemo component="date-picker" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Selected: Story = {
  args: {
    state: "Selected",
  },
}

export const Empty: Story = {
  args: {
    state: "Empty",
  },
}
