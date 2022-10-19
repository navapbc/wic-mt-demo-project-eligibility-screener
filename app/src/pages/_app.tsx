import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import Layout from '@components/Layout'

import useSessionStorage from '@src/hooks/useSessionStorage'
import '@styles/styles.scss'
import { initialSessionData } from '@utils/sessionData'

function MyApp({ Component, pageProps }: AppProps) {
  const sessionKey = 'session'
  const [session, setSession] = useSessionStorage(
    sessionKey,
    initialSessionData
  )

  // Pass in a prop for whether the form wizard is in review mode.
  const router = useRouter()
  const reviewMode = router.query.mode === 'review'

  // @TODO: all pages need form validation before loading, re-routing, and error handling
  // @TODO: fix conditional routing for /review page
  // @TODO: add tests for components
  const props = { ...pageProps, session, setSession, sessionKey, reviewMode }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
