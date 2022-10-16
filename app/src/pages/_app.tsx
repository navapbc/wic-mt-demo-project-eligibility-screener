import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import useSessionStorage from '@src/hooks/useSessionStorage'

import Layout from '@components/Layout'

import '@styles/styles.scss'
import { initialSessionData } from '@utils/sessionData'

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useSessionStorage('session', initialSessionData)

  // @TODO: move route into here
  // @TODO: all pages need form validation before loading, re-routing, and error handling
  // @TODO: back links need to be centrally controlled
  // @TODO: fix all stories
  // @TODO: add tests for components
  const props = { ...pageProps, session, setSession }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
