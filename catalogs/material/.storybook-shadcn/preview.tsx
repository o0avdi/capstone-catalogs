import type { Preview } from '@storybook/react-vite'

import '../src/shadcn/index.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: ['Shadcn', ['Accordion', '*']],
      },
    },
    controls: {
      expanded: true,
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
