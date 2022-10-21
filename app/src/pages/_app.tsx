import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

import Layout from '@components/Layout'
import RoutingError from '@components/RoutingError'

import useSessionStorage from '@src/hooks/useSessionStorage'
import '@styles/styles.scss'
import { getBackRoute, hasRoutingIssues } from '@utils/routing'
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

  // Handle back links.
  let backRoute = '/'
  try {
    backRoute = getBackRoute(router.pathname, session)
  } catch (e: unknown) {
    const error = e as Error
    console.log(`error caught: ${error.message}`)
    // Something bad happened on the /choose-clinic page with regard to session. Route to '/' with an error message.
    router.push({ pathname: '/', query: { error: 'missing-data' } })
  }

  // Handle form wizard page access.
  try {
    const outcome = hasRoutingIssues(router, session)
    if (outcome.error) {
      // See https://nextjs.org/docs/api-reference/next/router#potential-solutions
      // disable the linting on the next line
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push({ pathname: outcome.cause, query: { error: 'missing-data' } })
    }
  } catch (e: unknown) {
    const error = e as Error
    console.log(`error caught: ${error.message}`)
    // Something bad happened with regard to session. Route to '/' with an error message.
    router.push({ pathname: '/', query: { error: 'missing-data' } })
  }

  // @TODO: fix conditional routing for /eligibility page with regard to review
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
      <>
        {router.query.error === 'missing-data' && <RoutingError />}
        <Component {...props} />
      </>
    </Layout>
  )
}

export default appWithTranslation(MyApp)
