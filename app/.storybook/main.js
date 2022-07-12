const nextConfig = require('../next.config')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-scss'
  ],
  framework: '@storybook/react',
  core: {
    // Use webpack5 instead of webpack4
    builder: 'webpack5',
    disableTelemetry: true
  },
  // Tell storybook where to find USWDS static assets
  staticDirs: ['../public'],

  // Configure Storybook's final Webpack configuration in order to re-use the Next.js config/dependencies.
  webpackFinal: (config) => {
    config.module?.rules?.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          /**
           * Next.js sets this automatically for us, but we need to manually set it here for Storybook.
           * The main thing this enables is autoprefixer, so any experimental CSS properties work.
           */
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: ['postcss-preset-env']
            }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: nextConfig.sassOptions
          }
        }
      ],
      exclude: /node_modules/
    })
    /* workaround to support tsconfig module imports */
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      })
    ]

    return config
  }
}
