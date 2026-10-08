import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Bordered" | "Error"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Marker",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Marker examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/marker",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Bordered","Error"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="marker" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Bordered: Story = {
  args: {
    state: "Bordered",
  },
}

export const Error: Story = {
  args: {
    state: "Error",
  },
}
