import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { MouseEvent } from 'react'

import BackLink from '@components/BackLink'
import Button from '@components/Button'

import { clearSessionStorage } from '@src/hooks/useSessionStorage'
import type { ClearablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

const OtherBenefits: NextPage<ClearablePage> = (props: ClearablePage) => {
  const { setSession, sessionKey } = props
  const router = useRouter()

  // Handle the action button click for going back to the start of the form wizard.
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    // Clear the session storage.
    clearSessionStorage(sessionKey)
    // Then set the session state variable to blank.
    setSession(cloneDeep(initialSessionData))

    // Send the user back to the index page.
    // Disable the linting on the next line.
    // See https://nextjs.org/docs/api-reference/next/router#potential-eslint-errors
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push('/')
  }

  return (
    <>
      <BackLink href="/eligibility" />
      <h1>
        <Trans i18nKey="OtherBenefits.title" />
      </h1>
      <h2>
        <Trans i18nKey="OtherBenefits.subHeader" />
      </h2>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://dphhs.mt.gov/Assistance"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={'OtherBenefits.assistance'}
        />
      </p>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://www.signupwic.com/"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={'OtherBenefits.location'}
        />
      </p>
      <Button labelKey="OtherBenefits.button" onClick={handleClick} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default OtherBenefits
