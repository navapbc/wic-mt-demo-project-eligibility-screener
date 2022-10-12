import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import useSessionStorage from 'src/hooks/useSessionStorage'

import Layout from '@components/Layout'

import '@styles/styles.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useSessionStorage('session', {
    chooseClinic: {
      clinic: undefined,
      zipCode: '',
    },
    contact: {
      firstName: '',
      lastName: '',
      phone: '',
      comments: '',
    },
    eligibility: {
      residential: '',
      categorical: [],
      previouslyEnrolled: '',
      adjunctive: [],
    },
    income: {
      householdSize: '',
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
