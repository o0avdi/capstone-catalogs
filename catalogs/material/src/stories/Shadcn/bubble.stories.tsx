import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "WithReactions"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Bubble",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Bubble examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/bubble",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","WithReactions"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="bubble" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const WithReactions: Story = {
  args: {
    state: "WithReactions",
  },
}
