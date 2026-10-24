import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

// Isolated metadata experiment. Normal catalog presentation/config stays intact.
const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../*.stories.tsx',
    '../../../src/stories/Shadcn/{separator,badge,progress}.stories.tsx',
  ],
  addons: ['@storybook/addon-docs'],
  features: { componentsManifest: true },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Dependency-declared props are part of these components' public APIs.
      propFilter: () => true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: { alias: { '@': fileURLToPath(new URL('../../../src/shadcn', import.meta.url)) } },
    });
  },
};
export default config;
