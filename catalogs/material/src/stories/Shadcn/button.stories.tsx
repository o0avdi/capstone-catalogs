import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "Variants" | "Disabled" | "Loading"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Button",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Button examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/button",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","Variants","Disabled","Loading"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="button" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const Variants: Story = {
  args: {
    state: "Variants",
  },
}

export const Disabled: Story = {
  args: {
    state: "Disabled",
  },
}

export const Loading: Story = {
  args: {
    state: "Loading",
  },
}
