import { AppContext } from '@context/state'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import useLocalStorage from 'src/hooks/useLocalStorage'

import Layout from '@components/Layout'

import '@styles/styles.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useLocalStorage('session', {
    clinic: undefined,
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      other: '',
    },
    eligibility: {
      residential: '',
      pregnant: false,
      baby: false,
      child: false,
      guardian: false,
      none: false,
      loss: false,
      insurance: false,
      snap: false,
      tanf: false,
      none2: false,
    },
  })

  return (
    // @ts-ignore
    <AppContext.Provider value={{ session, setSession }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  )
}

export default appWithTranslation(MyApp)
