import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|mjs|ts)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/angular",
  "refs": {
    "shadcn-react-aria": {
      "title": "Shadcn",
      "url": "http://localhost:6007"
    }
  }
};
export default config;
