// Apply global styling to our stories
// Import to support next/router behavior in storybook.
// See https://storybook.js.org/addons/storybook-addon-next-router
import { RouterContext } from 'next/dist/shared/lib/router-context'

import '@styles/styles.scss'

// Import i18next config.
import i18n from './i18next.js'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // Configure i18next and locale/dropdown options.
  i18n,
  locale: 'en',
  locales: {
    en: 'English',
    es: 'Español',
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: [
        'Components',
        'Pages',
        [
          'Index',
          'How It Works',
          'Eligibility',
          'Income',
          'Choose Clinic',
          'Contact',
          'Review',
          'Confirmation',
        ],
      ],
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}
