import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'

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

  // We need to get the router here in order to tell react to remount
  // const router = useRouter()

  // @TODO: move route into here
  // @TODO: all pages need form validation before loading, re-routing, and error handling
  // @TODO: back links need to be centrally controlled
  // @TODO: fix conditional routing for /review page
  // @TODO: add tests for components
  const props = { ...pageProps, session, setSession, sessionKey }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
