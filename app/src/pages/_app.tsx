import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import useSessionStorage from 'src/hooks/useSessionStorage'

import Layout from '@components/Layout'

import '@styles/styles.scss'

import { initialSessionData } from '@utils/sessionData'

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useSessionStorage('session', initialSessionData)

  const props = { ...pageProps, session, setSession }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
