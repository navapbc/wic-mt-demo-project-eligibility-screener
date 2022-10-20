import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import ReviewSection from '@components/ReviewSection'

import type { ReadOnlyPage } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

interface ReviewProps extends ReadOnlyPage {
  backRoute: string
}

// @TODO: button onSubmit() should call an api function to submit the data to the mock api
const Review: NextPage<ReviewProps> = (props: ReviewProps) => {
  const { session, backRoute } = props

  // Using form to store all of the data in a component state
  // resolves all hydration issues.
  const [form, setForm] = useState(initialSessionData)
  useEffect(() => {
    setForm(session)
  }, [session])

  return (
    <>
      <BackLink href={backRoute} />
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <ReviewSection editable={true} session={form} />
      <ButtonLink href="/confirmation" labelKey="Review.button" />
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
