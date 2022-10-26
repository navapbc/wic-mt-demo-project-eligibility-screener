import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { MouseEvent, useEffect, useState } from 'react'

import PageError from '@components/PageError'
import BackLink from '@components/BackLink'
import Button from '@components/Button'
import ReviewSection from '@components/ReviewSection'

import {
  EligibilityScreenerBody,
  EligibilityScreenerResponse,
} from '@pages/api/eligibility-screener'

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
    const translatedCategorical = buildEligibilityArrays(
      sessionCopy.eligibility.categorical
    )
    const translatedAdjunctive = buildEligibilityArrays(
      sessionCopy.eligibility.adjunctive
    )

    const body: EligibilityScreenerBody = {
      session: sessionCopy,
      translatedCategorical: translatedCategorical,
      translatedAdjunctive: translatedAdjunctive,
    }

    const response = await fetch('/api/eligibility-screener', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json',
      },
    })

    if (response.status === 201) {
      setSession({ ...session, submitted: true })
      await router.push(forwardRoute)
    } else {
      const responseBody =
        (await response.json()) as EligibilityScreenerResponse
      setErrorMessage(`${t('Error.occurred')}: ${responseBody.error}`)
    }
  }

  return (
    <>
      {errorMessage && (
        <PageError alertBody={errorMessage} />
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
