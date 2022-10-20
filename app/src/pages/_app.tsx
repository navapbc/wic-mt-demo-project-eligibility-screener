import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import Layout from '@components/Layout'

import useSessionStorage from '@src/hooks/useSessionStorage'
import '@styles/styles.scss'
import { getBackRoute } from '@utils/routing'
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

  let backRoute = '/'
  try {
    backRoute = getBackRoute(router.pathname, session)
  } catch (e: unknown) {
    const error = e as Error
    console.log(`error caught: ${error.message}`)
  }

  // @TODO: all pages need form validation before loading, re-routing, and error handling
  // @TODO: fix conditional routing for /eligibility page
  // @TODO: fix conditional back button for /choose-clinic
  // @TODO: add tests for components
  const props = {
    ...pageProps,
    session,
    setSession,
    sessionKey,
    reviewMode,
    backRoute,
  }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
