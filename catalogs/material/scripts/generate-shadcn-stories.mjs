import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const storiesDirectory = join(root, "src", "stories", "Shadcn")

const components = [
  ["alert", "Alert", ["Basic", "Destructive", "WithAction"]],
  ["alert-dialog", "Alert Dialog", ["Basic", "Destructive"]],
  ["aspect-ratio", "Aspect Ratio", ["Widescreen", "Square"]],
  ["attachment", "Attachment", ["Basic", "Disabled"]],
  ["avatar", "Avatar", ["Basic", "WithBadge", "Group"]],
  ["badge", "Badge", ["Basic", "Variants"]],
  ["breadcrumb", "Breadcrumb", ["Basic", "Collapsed"]],
  ["bubble", "Bubble", ["Basic", "WithReactions"]],
  ["button", "Button", ["Basic", "Variants", "Disabled", "Loading"]],
  ["button-group", "Button Group", ["Basic", "WithLabel"]],
  ["calendar", "Calendar", ["Single", "Range"]],
  ["card", "Card", ["Basic", "WithAction", "Compact"]],
  ["carousel", "Carousel", ["Basic", "Multiple"]],
  ["chart", "Chart", ["Basic", "WithTooltip"]],
  ["checkbox", "Checkbox", ["Basic", "Checked", "Indeterminate", "Disabled"]],
  ["collapsible", "Collapsible", ["Collapsed", "Expanded"]],
  ["combobox", "Combobox", ["Basic", "Disabled"]],
  ["command", "Command", ["Basic", "DisabledItem"]],
  ["context-menu", "Context Menu", ["Basic", "DisabledItem"]],
  ["data-table", "Data Table", ["Basic", "Filtered"]],
  ["date-picker", "Date Picker", ["Selected", "Empty"]],
  ["dialog", "Dialog", ["Basic", "DisabledForm"]],
  ["direction", "Direction", ["LTR", "RTL"]],
  ["drawer", "Drawer", ["Basic"]],
  ["dropdown-menu", "Dropdown Menu", ["Basic", "DisabledItem"]],
  ["empty", "Empty", ["Basic", "Icon", "WithAction"]],
  ["field", "Field", ["Basic", "Invalid"]],
  ["hover-card", "Hover Card", ["Basic"]],
  ["input", "Input", ["Basic", "Invalid", "Disabled"]],
  ["input-group", "Input Group", ["Basic", "Invalid"]],
  ["input-otp", "Input OTP", ["Basic", "Disabled"]],
  ["item", "Item", ["Basic", "Outline", "Disabled"]],
  ["kbd", "Kbd", ["Basic", "Group"]],
  ["label", "Label", ["Basic", "Required"]],
  ["marker", "Marker", ["Basic", "Bordered", "Error"]],
  ["menubar", "Menubar", ["Basic", "DisabledItem"]],
  ["message", "Message", ["Basic", "Conversation"]],
  ["message-scroller", "Message Scroller", ["Basic", "Long"]],
  ["native-select", "Native Select", ["Basic", "Disabled"]],
  ["navigation-menu", "Navigation Menu", ["Basic", "DisabledLink"]],
  ["pagination", "Pagination", ["Basic", "ThirdPage"]],
  ["popover", "Popover", ["Basic", "Custom"]],
  ["progress", "Progress", ["Basic", "Indeterminate"]],
  ["questionnaire", "Questionnaire", ["Basic", "Skippable"]],
  ["radio-group", "Radio Group", ["Basic", "DisabledItem"]],
  ["resizable", "Resizable", ["Horizontal", "Vertical"]],
  ["scroll-area", "Scroll Area", ["Vertical", "Horizontal"]],
  ["select", "Select", ["Basic", "Disabled"]],
  ["separator", "Separator", ["Horizontal", "Vertical"]],
  ["sheet", "Sheet", ["Right", "Left"]],
  ["sidebar", "Sidebar", ["Basic", "AccordionActive"]],
  ["skeleton", "Skeleton", ["Basic", "Card"]],
  ["slider", "Slider", ["Basic", "Range", "Disabled"]],
  ["spinner", "Spinner", ["Basic", "Large", "InButton"]],
  ["switch", "Switch", ["Basic", "Selected", "Disabled", "ReadOnly"]],
  ["table", "Table", ["Basic", "Striped"]],
  ["tabs", "Tabs", ["Basic", "Line"]],
  ["textarea", "Textarea", ["Basic", "Filled", "Invalid", "Disabled"]],
  ["toast", "Toast", ["Success", "Error", "Loading"]],
  ["toggle", "Toggle", ["Basic", "Pressed", "Outline", "Disabled"]],
  ["toggle-group", "Toggle Group", ["Single", "Multiple"]],
  ["tooltip", "Tooltip", ["Basic", "Delayed"]],
  ["typography", "Typography", ["Scale", "Article"]],
]

await mkdir(storiesDirectory, { recursive: true })

for (const [slug, title, states] of components) {
  const stateType = states.map((state) => JSON.stringify(state)).join(" | ")
  const stateOptions = JSON.stringify(states)
  const source = `import type { Meta, StoryObj } from "@storybook/react-vite"

import { ComponentDemo } from "./_shared/component-demos"

type ComponentState = ${stateType}

type ComponentStoryArgs = {
  state: ComponentState
}

const meta = {
  title: "Shadcn/${title}",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "React Aria-based ${title} examples and component states. Documentation: https://ui.shadcn.com/docs/components/base/${slug}",
      },
    },
  },
  argTypes: {
    state: {
      control: { type: "select" },
      options: ${stateOptions},
      description: "Choose the component state displayed in the preview.",
      table: {
        category: "Component",
      },
    },
  },
  args: {
    state: ${JSON.stringify(states[0])},
  },
  render: (args) => <ComponentDemo component="${slug}" state={args.state} />,
} satisfies Meta<ComponentStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

${states.map((state) => `export const ${state}: Story = {
  args: {
    state: "${state}",
  },
}`).join("\n\n")}
`

  await writeFile(join(storiesDirectory, `${slug}.stories.tsx`), source)
}

console.log(`Generated ${components.length} Shadcn story files.`)
