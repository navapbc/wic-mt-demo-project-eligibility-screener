import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import path from 'path'
import { MouseEvent, useEffect, useState } from 'react'
import { UrlObject } from 'url'

import BackLink from '@components/BackLink'
import Button from '@components/Button'
import PageError from '@components/PageError'
import ReviewSection from '@components/ReviewSection'

import {
  EligibilityScreenerBody,
  EligibilityScreenerResponse,
} from '@pages/api/eligibility-screener'

import type { EditablePage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

interface ReviewProps extends EditablePage {
  baseUrl: string
}

const Review: NextPage<ReviewProps> = (props: ReviewProps) => {
  const {
    session,
    setSession,
    backRoute = '',
    forwardRoute = '',
    baseUrl,
  } = props

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

  // Note: This click handler returns a promise to an attribute that expects a return value of void. This is intentional.
  // We've disabled the eslint error.
  // See https://typescript-eslint.io/rules/no-misused-promises/#checksvoidreturn
  const handleClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    let routeToPush: string | UrlObject = ''

    // Do not resubmit if already submitted.
    if (session.submitted) {
      // Route to next page.
      routeToPush = forwardRoute
    }
    // If not already submitted, submit.
    else {
      const sessionCopy = cloneDeep(session)

      // Translate eligibility.categorical and eligibility.adjunctive to user-friendly content.
      const translatedCategorical = buildEligibilityArrays(
        sessionCopy.eligibility.categorical
      )
      const translatedAdjunctive = buildEligibilityArrays(
        sessionCopy.eligibility.adjunctive
      )

      // Create the body that /api/eligibility-screener expects.
      const body: EligibilityScreenerBody = {
        session: sessionCopy,
        translatedCategorical: translatedCategorical,
        translatedAdjunctive: translatedAdjunctive,
      }

      // Call /api/eligibility-screener.
      const screenerUrl = path.join(baseUrl, '/api/eligibility-screener')
      const response = await fetch(screenerUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
        },
      })

      console.log(response)

      // A 201 response means that /api/eligibility-screener created a new record.
      if (response.status === 201) {
        console.log('new submitted')
        // Mark this session as submitted so duplicate entries won't be created.
        setSession({ ...session, submitted: true })
        // Route to the next page.
        routeToPush = forwardRoute
      }
      // Any other responses indicate an error.
      else {
        console.log('error')
        const responseBody =
          (await response.json()) as EligibilityScreenerResponse
        setErrorMessage(`${t('apiError')} Error: ${responseBody.error}`)
        // Reload current page.
        routeToPush = ''
      }
    }
    // Note: All router.push() calls have linting disabled on them.
    // See https://nextjs.org/docs/api-reference/next/router#potential-solutions
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(routeToPush)
  }

  return (
    <>
      {errorMessage && <PageError alertBody={errorMessage} />}
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
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.PRODUCTION_URL

  return {
    props: {
      baseUrl: baseUrl,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Review
