import { useAppContext } from '@context/state'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import ReviewCollection from '@components/ReviewCollection'
import { ReviewElementProps } from '@components/ReviewElement'

type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'

type Program = 'insurance' | 'snap' | 'tanf' | 'fdpir'

type Contact = 'firstName' | 'lastName' | 'phone' | 'comments'

const Review: NextPage = () => {
  const { session } = useAppContext()

  const categoryKeys: Category[] = [
    'pregnant',
    'baby',
    'child',
    'guardian',
    'loss',
  ]
  const programKeys: Program[] = ['insurance', 'snap', 'tanf', 'fdpir']

  const formatEligibilitySelections = (
    keys: (Category | Program)[]
  ): string[] => {
    const returnVal: string[] = []

    keys.forEach((key: Category | Program) => {
      if (session.eligibility[key]) {
        returnVal.push(`Eligibility.${key}`)
      }
    })

    return returnVal
  }

  const eligibilityResponses = [
    {
      labelKey: 'Eligibility.residential',
      responseKeys: [session?.eligibility?.residential || ''],
      isList: false,
    },
    {
      labelKey: 'Eligibility.categorical',
      responseKeys: formatEligibilitySelections(categoryKeys),
      isList: true,
    },
    {
      labelKey: 'Eligibility.before',
      responseKeys: [session?.eligibility?.before.replace(/[2]/g, '') || ''],
      isList: false,
    },
    {
      labelKey: 'Eligibility.programs',
      responseKeys: formatEligibilitySelections(programKeys),
      isList: true,
    },
  ]

  const clinicResponses = [
    {
      labelKey: 'Review.clinicSelected',
      responseKeys: [
        (session?.clinic && (
          <ClinicInfo
            name={session?.clinic.clinic}
            streetAddress={session?.clinic.clinicAddress}
            phone={session?.clinic.clinicTelephone}
            isFormElement={false}
          />
        )) ||
          '',
      ],
      isList: false,
    },
  ]

  const contactResponses: ReviewElementProps[] = []
  const contactKeys = ['firstName', 'lastName', 'phone', 'comments']
  contactKeys.forEach((key: string) => {
    contactResponses.push({
      labelKey: `Contact.${key}`,
      responseKeys: [session?.contact[key as Contact] || ''],
      isList: false,
    })
  })

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
        reviewElements={eligibilityResponses}
      />
      <ReviewCollection
        headerKey="Clinic.title"
        editable={true}
        editHref="/clinic"
        reviewElements={clinicResponses}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={true}
        editHref="/contact"
        reviewElements={contactResponses}
      />
      <ButtonLink href="/summary" labelKey="Review.button" />
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
    !['/clinic', '/eligibility', '/contact'].includes(previousRoute as string)
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
