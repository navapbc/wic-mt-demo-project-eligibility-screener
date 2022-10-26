import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Layout from '@components/Layout'
import PageError from '@components/PageError'

import useSessionStorage from '@src/hooks/useSessionStorage'
import '@styles/styles.scss'
import { getBackRoute, getForwardRoute, hasRoutingIssues } from '@utils/routing'
import { initialSessionData } from '@utils/sessionData'

function MyApp({ Component, pageProps }: AppProps) {
  const sessionKey = 'session'
  const [session, setSession] = useSessionStorage(
    sessionKey,
    initialSessionData
  )

  // Note: All router.push() calls have linting disabled on them.
  // See https://nextjs.org/docs/api-reference/next/router#potential-solutions

  // Pass in a prop for whether the form wizard is in review mode.
  const router = useRouter()
  const reviewMode = router.query.mode === 'review'

  // Handle form wizard page access.
  useEffect(() => {
    try {
      const outcome = hasRoutingIssues(router.pathname, session)
      if (outcome.error) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push({
          pathname: outcome.cause,
          query: { error: 'missing-data' },
        })
      }
    } catch (e: unknown) {
      const error = e as Error
      console.log(`error caught: ${error.message}`)
      // Something bad happened with regard to session. Route to '/' with an error message.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push({ pathname: '/', query: { error: 'missing-data' } })
    }
  }, [router, session])

  // Handle back link.
  const backRoute = getBackRoute(router.pathname, session)

  // Handle action button.
  const forwardRoute = getForwardRoute(router.pathname, reviewMode, session)

  const props = {
    ...pageProps,
    session,
    setSession,
    sessionKey,
    reviewMode,
    backRoute,
    forwardRoute,
  }

  return (
    <Layout>
      <>
        {router.query.error === 'missing-data' && (
          <PageError alertBody="routingError" />
        )}
        <Component {...props} />
      </>
    </Layout>
  )
}

export default appWithTranslation(MyApp)
