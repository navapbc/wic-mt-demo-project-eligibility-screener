import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from '../public/locales/en/common.json'
import esCommon from '../public/locales/es/common.json'

// Setup react-i18next for tests. Load actual content along with some mocked content.
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    en: {
      common: enCommon,
      test: {
        transLine: {
          plainString: 'just text',
          plainStringOneLink: {
            text: 'first <0>second</0> third',
            links: ['https://external.com'],
          },
          plainStringLinks: {
            text: 'first <0>second</0> <1>third</1>',
            links: ['https://external.com', '/relative/link'],
          },
          plainStringLinksComplicated: {
            text: '<1>first</1> <0>second</0> third <0>fourth</0> <1>fifth</1>',
            links: ['https://external.com', '/relative/link'],
          },
          styledString: 'first <strong>second</strong> third',
          styledStringOneLink: {
            text: 'first <strong>second</strong> <0>third</0>',
            links: ['https://external.com'],
          },
          styledLink: {
            text: 'first <strong><0>second</0></strong>',
            links: ['https://external.com'],
          },
        },
      },
    },
    es: { common: esCommon },
  },
})

// Export i18n so tests can manually set the lanuage with:
// i18n.changeLanguage('es')
export default i18n
