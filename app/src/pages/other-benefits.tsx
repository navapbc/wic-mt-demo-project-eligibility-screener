import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'

import { clearSessionStorage } from '@src/hooks/useSessionStorage'
import type { ClearablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

const OtherBenefits: NextPage<ClearablePage> = (props: ClearablePage) => {
  const { setSession, sessionKey } = props

  // Handle the action button click for going back to the start of the form wizard.
  const handleClick = () => {
    // Clear the session storage.
    clearSessionStorage(sessionKey)
    // Then set the session state variable to blank.
    setSession(cloneDeep(initialSessionData))
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
      <ButtonLink
        labelKey="OtherBenefits.button"
        onClick={handleClick}
        href="/"
      />
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
