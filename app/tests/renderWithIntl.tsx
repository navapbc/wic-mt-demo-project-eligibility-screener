import en from '@messages/en.json'
import { render } from '@testing-library/react'
import { NextIntlProvider } from 'next-intl'

const renderWithIntl = (component: JSX.Element) => {
  return {
    ...render(<NextIntlProvider locale="en">{component}</NextIntlProvider>)
  }
}

export default renderWithIntl
