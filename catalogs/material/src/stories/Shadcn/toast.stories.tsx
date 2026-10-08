import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Success" | "Error" | "Loading"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Toast examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/toast",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Success","Error","Loading"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Success",
  },
  render: (args) => <ComponentDemo component="toast" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    state: "Success",
  },
}

export const Error: Story = {
  args: {
    state: "Error",
  },
}

export const Loading: Story = {
  args: {
    state: "Loading",
  },
}
