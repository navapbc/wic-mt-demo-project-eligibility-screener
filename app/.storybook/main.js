const nextConfig = require('../next.config')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path')

const BASE_PATH = process.env.BASE_PATH ?? ''

module.exports = {
  stories: ['../stories/**/*.stories.@(mdx|js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    'storybook-addon-next-router',
    'storybook-react-i18next',
  ],
  framework: '@storybook/react',
  core: {
    // Use webpack5 instead of webpack4.
    builder: 'webpack5',
    disableTelemetry: true,
  },
  // Tell storybook where to find USWDS static assets
  staticDirs: ['../public'],

  // Support deploying Storybook to a subdirectory (like GitHub Pages).
  // This makes `process.env.BASE_PATH` available to our source code.
  // @ts-expect-error - https://github.com/storybookjs/storybook/issues/19294
  env: (config) => ({
    ...config,
    BASE_PATH,
  }),

  // Configure Storybook's final Webpack configuration in order to re-use the Next.js config/dependencies.
  webpackFinal: (config) => {
    config.module?.rules?.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'string-replace-loader',
          options: {
            // Support deploying Storybook to a subdirectory (like GitHub Pages).
            // This adds the BASE_PATH to the beginning of all relative URLs in the CSS.
            search: /url\(("?)\//,
            replace(match, p1, offset, string) {
              console.log(`Replace "${match}" in file "${this.resource}".`)
              return `url(${p1}${BASE_PATH}/`
            },
            flags: 'g',
          },
        },
        {
          /**
           * Next.js sets this automatically for us, but we need to manually set it here for Storybook.
           * The main thing this enables is autoprefixer, so any experimental CSS properties work.
           */
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: ['postcss-preset-env'],
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: nextConfig.sassOptions,
          },
        },
      ],
      exclude: /node_modules/,
    })

    /* workaround to support tsconfig module imports */
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ]

    // Workaround for TsconfigPathsPlugin not being able to resolve @public
    config.resolve.alias = {
      ...config.resolve.alias,
      '@public': path.resolve(__dirname, '../public'),
    }

    // Required for i18next.
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    }

    // Support deploying Storybook to a subdirectory (like GitHub Pages).
    // This makes the Storybook JS bundles load correctly.
    if (BASE_PATH) {
      config.output = config.output ?? {}
      config.output.publicPath = `${BASE_PATH}/`
    }

    return config
  },
}
