import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import Button from '@components/Button'
import ReviewSection from '@components/ReviewSection'

import type { EditablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

const Review: NextPage<EditablePage> = (props: EditablePage) => {
  const { session, setSession, backRoute = '', forwardRoute = '' } = props

  // Using form to store all of the data in a component state
  // resolves all hydration issues.
  const [form, setForm] = useState(initialSessionData)
  useEffect(() => {
    setForm(session)
  }, [session])

  const [errorMessage, setErrorMessage] = useState('')

  const { t } = useTranslation('common')

  const router = useRouter()

  const buildEligibilityArrays = (data: string[]) => {
    return data.map((category) => t(`Eligibility.${category}`))
  }

  const handleClick = async (e: MouseEvent<HTMLElement>): Promise<void> => {
    e.preventDefault()

    const sessionCopy = cloneDeep(session)
    sessionCopy.eligibility.categorical = buildEligibilityArrays(
      sessionCopy.eligibility.categorical
    )
    sessionCopy.eligibility.adjunctive = buildEligibilityArrays(
      sessionCopy.eligibility.adjunctive
    )

    const response = await fetch('/api/eligibility-screener', {
      method: 'POST',
      body: JSON.stringify(sessionCopy),
      headers: {
        'Content-type': 'application/json',
      },
    })

    if (response.status === 201) {
      setSession({ ...session, submitted: true })
      await router.push(forwardRoute)
    } else {
      const responseBody: object = (await response.json()) as object
      setErrorMessage(`${t('Error.occurred')}: ${responseBody.error as string}`)
    }
  }

  return (
    <>
      {errorMessage && (
        <div className="margin-bottom-3">
          <Alert type="error" icon={true} alertBody={errorMessage} />
        </div>
      )}
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <ReviewSection editable={true} session={form} />
      <Button labelKey="Review.button" onClick={handleClick} />
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

export default Review
