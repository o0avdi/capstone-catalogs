import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Right" | "Left"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Sheet",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Sheet examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/sheet",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Right","Left"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Right",
  },
  render: (args) => <ComponentDemo component="sheet" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Right: Story = {
  args: {
    state: "Right",
  },
}

export const Left: Story = {
  args: {
    state: "Left",
  },
}
