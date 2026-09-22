import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  BrnAccordion,
  BrnAccordionImports,
} from '@spartan-ng/brain/accordion';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';

const meta: Meta<BrnAccordion> = {
  title: 'Spartan/Accordion',
  component: BrnAccordion,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [...BrnAccordionImports, ...HlmAccordionImports],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<BrnAccordion>;

export const Default: Story = {
  render: () => ({
    template: `
      <hlm-accordion class="block w-full max-w-md">
        <hlm-accordion-item>
          <hlm-accordion-trigger>
            What are your shipping options?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            We offer standard, express, and overnight shipping.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            What is your return policy?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Returns are accepted within 30 days.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            How can I contact support?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Contact us by email or live chat.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    template: `
      <hlm-accordion type="multiple" class="block w-full max-w-md">
        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Can multiple panels be open?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. Open this panel, then open another one.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Does each panel keep its state?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. Panels can remain open independently in multiple mode.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Can I close a panel again?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. Click its heading again to close it.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
  }),
};

export const InitiallyOpen: Story = {
  render: () => ({
    template: `
      <hlm-accordion class="block w-full max-w-md">
        <hlm-accordion-item isOpened>
          <hlm-accordion-trigger>
            This panel starts open
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            The isOpened input sets its initial state.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            This panel starts closed
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Click to open this panel.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
  }),
};

export const DisabledItem: Story = {
  render: () => ({
    template: `
      <hlm-accordion class="block w-full max-w-md">
        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Available item
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            This item opens normally.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item disabled>
          <hlm-accordion-trigger>
            Disabled item
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            This content cannot be opened.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item>
          <hlm-accordion-trigger>
            Another available item
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            This item also opens normally.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
  }),
};

export const Bordered: Story = {
  render: () => ({
    template: `
      <hlm-accordion class="block w-full max-w-md rounded-lg border">
        <hlm-accordion-item class="border-b px-4">
          <hlm-accordion-trigger>
            How does billing work?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Billing occurs at the start of each subscription period.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item class="border-b px-4">
          <hlm-accordion-trigger>
            Can I change plans?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            Yes. You can change your plan from account settings.
          </hlm-accordion-content>
        </hlm-accordion-item>

        <hlm-accordion-item class="px-4">
          <hlm-accordion-trigger>
            How do I cancel?
          </hlm-accordion-trigger>
          <hlm-accordion-content>
            You can cancel from account settings at any time.
          </hlm-accordion-content>
        </hlm-accordion-item>
      </hlm-accordion>
    `,
  }),
};