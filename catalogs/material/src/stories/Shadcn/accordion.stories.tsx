import type { Key } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useArgs } from "storybook/preview-api"
import { fn } from "storybook/test"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AccordionEntry = {
  id: string
  title: string
  content: string
}

type AccordionArgs = {
  items: AccordionEntry[]
  expandedKeys: string[]
  disabledItemIds: string[]
  allowsMultipleExpanded: boolean
  presentation: "default" | "bordered" | "card"
  onExpandedChange: (expandedKeys: string[]) => void
}

const defaultItems: AccordionEntry[] = [
  {
    id: "shipping",
    title: "What are your shipping options?",
    content:
      "We offer standard shipping in 5–7 days, express shipping in 2–3 days, and overnight shipping. International delivery times vary by destination.",
  },
  {
    id: "returns",
    title: "What is your return policy?",
    content:
      "Returns are accepted within 30 days. Items must be unused and in their original packaging. Refunds are processed within 5–7 business days.",
  },
  {
    id: "support",
    title: "How can I contact customer support?",
    content:
      "You can reach our support team by email, live chat, or phone. We normally respond within 24 hours on business days.",
  },
]

const meta: Meta<AccordionArgs> = {
  title: "Shadcn/Accordion",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings built with the shadcn Accordion components.",
      },
    },
  },
  argTypes: {
    items: {
      control: "object",
      description:
        "Story data used to create the accordion items, triggers, and content.",
    },
    expandedKeys: {
      control: "object",
      description: "The IDs of the currently expanded accordion items.",
    },
    disabledItemIds: {
      control: "object",
      description:
        "The IDs of accordion items that cannot be expanded or collapsed.",
    },
    allowsMultipleExpanded: {
      control: "boolean",
      description:
        "Allows multiple accordion items to remain expanded simultaneously.",
    },
    presentation: {
      control: "select",
      options: ["default", "bordered", "card"],
      description:
        "Story-only presentation based on the examples in the shadcn documentation.",
    },
    onExpandedChange: {
      control: false,
      description:
        "Story callback receiving the IDs of the expanded accordion items.",
    },
  },
  args: {
    items: defaultItems,
    expandedKeys: ["shipping"],
    disabledItemIds: [],
    allowsMultipleExpanded: false,
    presentation: "default",
    onExpandedChange: fn(),
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs<AccordionArgs>()

    const handleExpandedChange = (keys: Set<Key>) => {
      const expandedKeys = Array.from(keys, String)

      args.onExpandedChange(expandedKeys)
      updateArgs({ expandedKeys })
    }

    const accordion = (
      <Accordion
        expandedKeys={new Set(args.expandedKeys)}
        allowsMultipleExpanded={args.allowsMultipleExpanded}
        onExpandedChange={handleExpandedChange}
        className={
          args.presentation === "bordered"
            ? "rounded-lg border px-4"
            : undefined
        }
      >
        {args.items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            isDisabled={args.disabledItemIds.includes(item.id)}
            className={
              args.presentation === "bordered"
                ? "border-b last:border-b-0"
                : undefined
            }
          >
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )

    if (args.presentation === "card") {
      return (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Subscription and billing</CardTitle>
            <CardDescription>
              Common questions about accounts, plans, payments, and
              cancellations.
            </CardDescription>
          </CardHeader>
          <CardContent>{accordion}</CardContent>
        </Card>
      )
    }

    return <div className="w-full max-w-2xl">{accordion}</div>
  },
}

export default meta
type Story = StoryObj<AccordionArgs>

export const Basic: Story = {}

export const Multiple: Story = {
  args: {
    allowsMultipleExpanded: true,
    expandedKeys: ["shipping", "returns"],
  },
}

export const Disabled: Story = {
  args: {
    expandedKeys: ["shipping"],
    disabledItemIds: ["returns"],
  },
}

export const Borders: Story = {
  args: {
    presentation: "bordered",
    expandedKeys: ["shipping"],
  },
}

export const CardExample: Story = {
  name: "Card",
  args: {
    presentation: "card",
    expandedKeys: ["returns"],
  },
}

export const AllCollapsed: Story = {
  args: {
    expandedKeys: [],
  },
}

export const LongContent: Story = {
  args: {
    expandedKeys: ["support"],
    items: [
      ...defaultItems.slice(0, 2),
      {
        id: "support",
        title: "How can I contact customer support?",
        content:
          "Contact our support team through email, live chat, or phone. Standard support is available Monday through Friday from 9:00 AM to 5:00 PM. Enterprise customers also receive access to priority assistance, dedicated account management, and emergency support outside normal business hours.",
      },
    ],
  },
}
