import { useTranslation } from 'next-i18next'
import Head from 'next/head'

export type PageTitleProps = {
  pathname: string
}

const PageTitle = (props: PageTitleProps) => {
  const { pathname } = props

  const { t } = useTranslation('common')
  let pageTitle = ''
  let i18nPageKey = ''

  // Handle the index page.
  if (pathname === '/') {
    i18nPageKey = 'Index'
  }
  // Convert all other pathnames to capital camel case to match i18n content file.
  else {
    i18nPageKey = pathname
      .toLowerCase()
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
      )
      .replace(/^\/[a-z]/, (group) => group.replace('/', '').toUpperCase())
  }

  pageTitle = t(`${i18nPageKey}.title`)

  // Fallback to the layout header if there is no page title found.
  if (/\.title$/.test(pageTitle)) {
    pageTitle = t('Layout.header')
  }

  return (
    <Head>
      <title>{pageTitle}</title>
    </Head>
  )
}

export default PageTitle
