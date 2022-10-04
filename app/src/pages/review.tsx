import { DefaultState, useAppContext } from '@context/state'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ReactElement } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import List from '@components/List'
import ReviewCollection from '@components/ReviewCollection'
import { ReviewElementProps } from '@components/ReviewElement'

type Contact = 'firstName' | 'lastName' | 'phone' | 'comments'

const formatCategoricalOrAdjunctive = (
  session: DefaultState,
  category?: boolean /* if not category, then considered program */
): ReactElement => {
  const i18nKeys: string[] = []
  const categoryOrProgram =
    session.eligibility[category ? 'categorical' : 'programs']
  const categoryOrProgramKeys = Object.keys(
    categoryOrProgram
  ) as (keyof typeof categoryOrProgram)[]

  categoryOrProgramKeys.forEach((key: keyof typeof categoryOrProgram) => {
    if (categoryOrProgram[key]) {
      i18nKeys.push(`Eligibility.${key}`)
    }
  })

  return <List i18nKeys={i18nKeys} />
}

export const formatEligibilityResponses = (
  session: DefaultState
): ReviewElementProps[] => {
  return [
    {
      labelKey: 'Eligibility.residential',
      children:
        (session?.eligibility?.residential && (
          <Trans i18nKey={session?.eligibility?.residential} />
        )) ||
        null,
    },
    {
      labelKey: 'Eligibility.categorical',
      children: formatCategoricalOrAdjunctive(session, true),
    },
    {
      labelKey: 'Eligibility.before',
      children:
        (session?.eligibility?.before && (
          <Trans i18nKey={session?.eligibility?.before.replace(/[2]/g, '')} />
        )) ||
        null,
    },
    {
      labelKey: 'Eligibility.programs',
      children: formatCategoricalOrAdjunctive(session),
    },
  ]
}

export const formatClinicResponses = (
  session: DefaultState
): ReviewElementProps[] => {
  return [
    {
      labelKey: 'Review.clinicSelected',
      children:
        (session?.clinic && (
          <ClinicInfo
            name={session?.clinic.clinic}
            streetAddress={session?.clinic.clinicAddress}
            phone={session?.clinic.clinicTelephone}
            isFormElement={false}
          />
        )) ||
        null,
    },
  ]
}

export const formatContactResponses = (
  session: DefaultState
): ReviewElementProps[] => {
  const contactResponses: ReviewElementProps[] = []
  Object.keys(session.contact).forEach((key: string) => {
    contactResponses.push({
      labelKey: `Contact.${key}`,
      children:
        (session?.contact[key as Contact] && (
          <Trans i18nKey={session?.contact[key as Contact]} />
        )) ||
        null,
    })
  })
  return contactResponses
}

const Review: NextPage = () => {
  const { session } = useAppContext()

  return (
    <>
      <BackLink href="/contact" />
      <h1>
        <Trans i18nKey="Review.title" />
      </h1>
      <p>
        <Trans i18nKey="Review.subHeader" />
      </p>
      <ReviewCollection
        headerKey="Review.eligibilityTitle"
        editable={true}
        editHref="/eligibility"
        reviewElements={formatEligibilityResponses(session)}
      />
      <ReviewCollection
        headerKey="ChooseClinic.title"
        editable={true}
        editHref="/clinic"
        reviewElements={formatClinicResponses(session)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={true}
        editHref="/contact"
        reviewElements={formatContactResponses(session)}
      />
      <ButtonLink href="/confirmation" labelKey="Review.button" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  const previousRoute =
    prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  let returnval: GetServerSidePropsResult<{ [key: string]: object }> = {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }

  if (
    !['/choose-clinic', '/eligibility', '/contact'].includes(
      previousRoute as string
    )
  ) {
    returnval = {
      ...returnval,
      redirect: {
        destination: previousRoute || '/',
        permanent: false,
      },
    }
  }

  return returnval
}

export default Review
