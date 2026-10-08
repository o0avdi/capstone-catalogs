import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Collapsed" | "Expanded"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Collapsible",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Collapsible examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/collapsible",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Collapsed","Expanded"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Collapsed",
  },
  render: (args) => <ComponentDemo component="collapsible" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Collapsed: Story = {
  args: {
    state: "Collapsed",
  },
}

export const Expanded: Story = {
  args: {
    state: "Expanded",
  },
}
