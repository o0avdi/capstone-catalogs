import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = "Scale" | "Article"

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/Typography",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based Typography examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/typography",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ["Scale","Article"],
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: "Scale",
  },
  render: (args) => <ComponentDemo component="typography" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Scale: Story = {
  args: {
    state: "Scale",
  },
}

export const Article: Story = {
  args: {
    state: "Article",
  },
}
