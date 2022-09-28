import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import ReviewCollection from '@components/ReviewCollection'
import { ReviewElementProps } from '@components/ReviewElement'
import StyledLink from '@components/StyledLink'

type Category = 'pregnant' | 'baby' | 'child' | 'guardian' | 'loss'

type Program = 'insurance' | 'snap' | 'tanf' | 'fdpir'

type Contact = 'firstName' | 'lastName' | 'phone' | 'comments'

const Summary: NextPage = () => {
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
      <h1>
        <Trans i18nKey="Summary.title" />
      </h1>
      <p>
        <Trans i18nKey="Summary.body" />
      </p>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.interestedIn" />
        </h4>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            textKey="Summary.learnAbout"
            external={true}
          />
        </p>
      </div>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.submitAnother" />
        </h4>
        <ButtonLink labelKey="Summary.startNew" href="/" style="outline" />
      </div>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.keepCopy" />
        </h4>
      </div>
      <ReviewCollection
        headerKey="Review.eligibilityTitle"
        editable={false}
        editHref="/eligibility"
        reviewElements={eligibilityResponses}
      />
      <ReviewCollection
        headerKey="Clinic.title"
        editable={false}
        editHref="/clinic"
        reviewElements={clinicResponses}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={false}
        editHref="/contact"
        reviewElements={contactResponses}
      />
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

export default Summary
