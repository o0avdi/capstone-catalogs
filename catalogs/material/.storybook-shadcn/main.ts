import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/stories/Shadcn/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite",
  "docs": {
    "defaultName": "Documentation"
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": resolve(import.meta.dirname, "../src/shadcn"),
        },
      },
    });
  }
};
export default config;
