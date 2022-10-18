import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import ClinicInfo from '@components/ClinicInfo'
import List from '@components/List'
import ReviewCollection from '@components/ReviewCollection'
import { ReviewElementProps } from '@components/ReviewElement'

import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  ReadOnlyPage,
} from '@src/types'
import { initialSessionData } from '@utils/sessionData'

// @TODO: button onSubmit() should call an api function to submit the data to the mock api
export const formatEligibilityResponses = (
  eligibility: EligibilityData
): ReviewElementProps[] => {
  const categoricalKeys = eligibility.categorical.map((key: string) => {
    return `Eligibility.${key}`
  })
  const adjunctiveKeys = eligibility.adjunctive.map((key: string) => {
    return `Eligibility.${key}`
  })

  return [
    {
      labelKey: 'Eligibility.residential',
      children: <Trans i18nKey={`Eligibility.${eligibility.residential}`} />,
    },
    {
      labelKey: 'Eligibility.categorical',
      children: <List i18nKeys={categoricalKeys} />,
    },
    {
      labelKey: 'Eligibility.previouslyEnrolled',
      children: (
        <Trans i18nKey={`Eligibility.${eligibility.previouslyEnrolled}`} />
      ),
    },
    {
      labelKey: 'Eligibility.adjunctive',
      children: <List i18nKeys={adjunctiveKeys} />,
    },
  ]
}

export const formatIncomeResponses = (income: IncomeData) => {
  return [
    {
      labelKey: 'Income.householdSize',
      children: <div>{income.householdSize}</div>,
    },
  ]
}

export const formatClinicResponses = (
  chooseClinic: ChooseClinicData
): ReviewElementProps[] => {
  const zipCodeElement = {
    labelKey: 'Review.zipCode',
    children: <div>{chooseClinic.zipCode}</div>,
  }

  let clinic = <></>
  if (chooseClinic.clinic !== undefined) {
    clinic = (
      <ClinicInfo
        name={chooseClinic.clinic.clinic}
        streetAddress={chooseClinic.clinic.clinicAddress}
        phone={chooseClinic.clinic.clinicTelephone}
        isFormElement={false}
      />
    )
  }
  const clinicElement = {
    labelKey: 'Review.clinicSelected',
    children: clinic,
  }

  return [zipCodeElement, clinicElement]
}

export const formatContactResponses = (
  contact: ContactData
): ReviewElementProps[] => {
  const contactResponses: ReviewElementProps[] = []
  for (const key in contact) {
    contactResponses.push({
      labelKey: `Contact.${key}`,
      children: <Trans i18nKey={contact[key as keyof typeof contact]} />,
    })
  }
  return contactResponses
}

const Review: NextPage<ReadOnlyPage> = (props: ReadOnlyPage) => {
  const { session } = props

  // Using form to store all of the data in a component state
  // resolves all hydration issues.
  const [form, setForm] = useState(initialSessionData)
  useEffect(() => {
    setForm(session)
  }, [session])

  const reviewMode = { mode: 'review' }

  const showHouseholdSize =
    form.income.householdSize !== '' &&
    form.eligibility.adjunctive.includes('none')

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
        reviewElements={formatEligibilityResponses(form.eligibility)}
      />
      {showHouseholdSize && (
        <ReviewCollection
          headerKey="Income.householdSize"
          editable={true}
          editHref={{ pathname: '/income', query: reviewMode }}
          reviewElements={formatIncomeResponses(form.income)}
        />
      )}
      <ReviewCollection
        headerKey="ChooseClinic.title"
        editable={true}
        editHref={{ pathname: '/choose-clinic', query: reviewMode }}
        reviewElements={formatClinicResponses(form.chooseClinic)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={true}
        editHref={{ pathname: '/contact', query: reviewMode }}
        reviewElements={formatContactResponses(form.contact)}
      />
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
