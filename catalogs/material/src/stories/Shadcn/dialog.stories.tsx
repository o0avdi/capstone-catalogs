import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "DisabledForm"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Dialog",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Dialog examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/dialog",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","DisabledForm"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="dialog" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const DisabledForm: Story = {
  args: {
    state: "DisabledForm",
  },
}
