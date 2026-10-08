import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Basic" | "ThirdPage"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Pagination",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Pagination examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/pagination",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Basic","ThirdPage"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Basic",
  },
  render: (args) => <ComponentDemo component="pagination" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    state: "Basic",
  },
}

export const ThirdPage: Story = {
  args: {
    state: "ThirdPage",
  },
}
