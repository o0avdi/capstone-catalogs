import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "DisabledLink"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Navigation Menu",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Navigation Menu examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/navigation-menu",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","DisabledLink"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="navigation-menu" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const DisabledLink: Story = {
  args: {
    state: "DisabledLink",
  },
}
