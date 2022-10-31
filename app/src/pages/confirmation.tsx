import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'

import ButtonLink from '@components/ButtonLink'
import ReviewSection from '@components/ReviewSection'
import StyledLink from '@components/StyledLink'

import { clearSessionStorage } from '@src/hooks/useSessionStorage'
import type { ClearablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

const Confirmation: NextPage<ClearablePage> = (props: ClearablePage) => {
  const { session, setSession, sessionKey } = props

  // Using form to store all of the data in a component state
  // resolves all hydration issues.
  const [form, setForm] = useState(initialSessionData)
  useEffect(() => {
    setForm(session)
  }, [session])

  // Handle the action button click for going back to the start of the form wizard.
  const handleClick = () => {
    // Clear the session storage.
    clearSessionStorage(sessionKey)
    // Then set the session state variable to blank.
    setSession(cloneDeep(initialSessionData))
  }

  return (
    <>
      <h1>
        <Trans i18nKey="Confirmation.title" />
      </h1>
      <p>
        <Trans i18nKey="Confirmation.body" />
      </p>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.interestedIn" />
        </h2>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            textKey="Confirmation.learnAbout"
            external={true}
          />
        </p>
      </div>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.submitAnother" />
        </h2>
        <ButtonLink
          labelKey="Confirmation.startNew"
          style="outline"
          onClick={handleClick}
          href="/"
        />
      </div>
      <div className="content-group-small">
        <h2 className="font-sans-xs">
          <Trans i18nKey="Confirmation.keepCopy" />
        </h2>
      </div>
      <ReviewSection editable={false} session={form} />
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

export default Confirmation
