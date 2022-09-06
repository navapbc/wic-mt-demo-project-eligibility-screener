import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { useState } from 'react'

import Layout from '@components/Layout'

import '@styles/styles.scss'

import { AppContext } from '../context/state'

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState({
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
    }
  })

  return (
    <AppContext.Provider value={{ session, setSession }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  )
}

export default appWithTranslation(MyApp)
