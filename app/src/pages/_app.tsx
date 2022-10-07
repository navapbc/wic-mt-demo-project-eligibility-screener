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
      comments: '',
    },
    eligibility: {
      residential: '',
      pregnant: false,
      baby: false,
      child: false,
      guardian: false,
      none: false,
      loss: false,
      before: '',
      insurance: false,
      snap: false,
      tanf: false,
      fdpir: false,
      none2: false,
    },
  })

  const props = { ...pageProps, session, setSession }

  return (
    <Layout>
      <Component {...props} />
    </Layout>
  )
}

export default appWithTranslation(MyApp)
