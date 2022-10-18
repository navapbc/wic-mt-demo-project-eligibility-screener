import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'

import Button from '@components/Button'
import ReviewSection from '@components/ReviewSection'
import StyledLink from '@components/StyledLink'

import { clearSessionStorage } from '@src/hooks/useSessionStorage'
import type { ClearablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

const Confirmation: NextPage<ClearablePage> = (props: ClearablePage) => {
  const { session, setSession, sessionKey } = props
  const router = useRouter()

  // Using form to store all of the data in a component state
  // resolves all hydration issues.
  const [form, setForm] = useState(initialSessionData)
  useEffect(() => {
    setForm(session)
  }, [session])

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
        <Button
          labelKey="Confirmation.startNew"
          style="outline"
          onClick={handleClick}
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
