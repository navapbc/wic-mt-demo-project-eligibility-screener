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

import type { ReadOnlyPage, SessionData } from '@src/types'

// @TODO: pull most of this out of this file and into a shared location
// @TODO: refactor
// @TODO: button onSubmit() should call an api function to submit the data to the mock api
type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'
type Program = 'insurance' | 'snap' | 'tanf' | 'fdpir'
type Contact = 'firstName' | 'lastName' | 'phone' | 'comments'

const categoryKeys: Category[] = [
  'pregnant',
  'baby',
  'child',
  'guardian',
  'loss',
]
const programKeys: Program[] = ['insurance', 'snap', 'tanf', 'fdpir']
const contactKeys: Contact[] = ['firstName', 'lastName', 'phone', 'comments']

const formatCategoricalOrAdjunctive = (
  keys: (Category | Program)[],
  session: SessionData
): ReactElement => {
  const i18nKeys: string[] = []

  keys.forEach((key: Category | Program) => {
    if (session.eligibility[key]) {
      i18nKeys.push(`Eligibility.${key}`)
    }
  })

  return <List i18nKeys={i18nKeys} />
}

export const formatEligibilityResponses = (
  session: SessionData
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
      children: formatCategoricalOrAdjunctive(categoryKeys, session),
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
      children: formatCategoricalOrAdjunctive(programKeys, session),
    },
  ]
}

export const formatClinicResponses = (
  session: SessionData
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
  session: SessionData
): ReviewElementProps[] => {
  const contactResponses: ReviewElementProps[] = []
  contactKeys.forEach((key: string) => {
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

const Review: NextPage<ReadOnlyPage> = (props: ReadOnlyPage) => {
  const { session } = props

  const reviewMode = { mode: 'review' }

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
        editHref={{ pathname: '/eligibility', query: reviewMode }}
        reviewElements={formatEligibilityResponses(session)}
      />
      <ReviewCollection
        headerKey="Clinic.title"
        editable={true}
        editHref={{ pathname: '/choose-clinic', query: reviewMode }}
        reviewElements={formatClinicResponses(session)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={true}
        editHref={{ pathname: '/contact', query: reviewMode }}
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
  // const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  // const previousRoute =
  //   prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  // let returnval: GetServerSidePropsResult<{ [key: string]: object }> = {
  //   props: {
  //     ...(await serverSideTranslations(locale || 'en', ['common'])),
  //   },
  // }

  // if (
  //   !['/choose-clinic', '/eligibility', '/contact'].includes(
  //     previousRoute as string
  //   )
  // ) {
  //   returnval = {
  //     ...returnval,
  //     redirect: {
  //       destination: previousRoute || '/',
  //       permanent: false,
  //     },
  //   }
  // }

  // return returnval
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Review
