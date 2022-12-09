/**
 * The Review page (/review) is the most complicated page because it handles submitting
 * the form that's been being created throughout the form wizard.
 *
 * There are so many data validation guards on this page. Every form wizard page must
 * be filled out with valid data in order for the user to access this page.
 */
import cloneDeep from 'lodash/cloneDeep'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import path from 'path'
import { MouseEvent, useEffect, useState } from 'react'

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

  // This is a little silly, but session stores the object keys (e.g. 'pregnant',
  // 'foster') and we don't want to send that to the api. Instead, we want to send the
  // human-friendly string to the api (e.g. "I'm pregnant", "I'm the guardian or foster
  // parent of an infant or child under the age of 5 years old").
  const buildEligibilityArrays = (data: string[]) => {
    return data.map((category) => t(`Eligibility.${category}`))
  }

  // This handleClick is very complicated. It is written to make the fetch() call in
  // such a way as not to return a dangling promise. If there are no errors with the
  // api call, the user gets routed to /confirmation via next.js next/router. If there
  // are errors, then we reload the current page and display an error.

  // Note: All router.push() calls have linting disabled on them.
  // See https://nextjs.org/docs/api-reference/next/router#potential-solutions
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    // Do not resubmit if already submitted.
    if (session.submitted) {
      // Route to next page.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(forwardRoute)
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
      fetch(screenerUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          return response.json()
        })
        .then((data: EligibilityScreenerResponse) => {
          if (data.success) {
            // Mark this session as submitted so duplicate entries won't be created.
            setSession({ ...session, submitted: true })
            // Route to the next page.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push(forwardRoute)
          } else {
            console.log(
              'An error occurred while attempting to submit the session',
              data.error
            )
            setErrorMessage(`${t('apiError')} Error: ${data.error}`)
            // Reload current page.
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            router.push('')
          }
        })
        .catch((error) => {
          console.log(
            'An error occurred while attempting to call fetch()',
            error
          )
          setErrorMessage(`${t('apiError')}`)
          // Reload current page.
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          router.push('')
        })
    }
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
  const baseUrl = process.env.BASE_URL || ''

  return {
    props: {
      baseUrl: baseUrl,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Review
