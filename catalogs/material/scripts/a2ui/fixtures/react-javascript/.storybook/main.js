export default {
  framework: '@storybook/react-vite',
  stories: ['../*.stories.jsx'],
  addons: ['@storybook/addon-docs'],
  features: { componentsManifest: true },
  typescript: { reactDocgen: 'react-docgen' },
};
