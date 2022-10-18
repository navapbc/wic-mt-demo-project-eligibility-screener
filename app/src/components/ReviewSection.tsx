import { Trans } from 'next-i18next'
import { ReactElement } from 'react'

import ClinicInfo from '@components/ClinicInfo'
import List from '@components/List'
import ReviewCollection from '@components/ReviewCollection'
import { ReviewElementProps } from '@components/ReviewElement'

import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  SessionData,
} from '@src/types'

type ReviewSectionProps = {
  editable: boolean
  session: SessionData
}

// @TODO: add storybook story
const ReviewSection = (props: ReviewSectionProps): ReactElement => {
  const { editable, session } = props

  const reviewMode = { mode: 'review' }

  const showHouseholdSize =
    session.income.householdSize !== '' &&
    session.eligibility.adjunctive.includes('none')

  const formatEligibilityResponses = (
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

  const formatIncomeResponses = (income: IncomeData) => {
    return [
      {
        labelKey: 'Income.householdSize',
        children: <div>{income.householdSize}</div>,
      },
    ]
  }

  const formatClinicResponses = (
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

  const formatContactResponses = (
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

  return (
    <>
      <ReviewCollection
        headerKey="Review.eligibilityTitle"
        editable={editable}
        editHref={{ pathname: '/eligibility', query: reviewMode }}
        reviewElements={formatEligibilityResponses(session.eligibility)}
      />
      {showHouseholdSize && (
        <ReviewCollection
          headerKey="Income.householdSize"
          editable={editable}
          editHref={{ pathname: '/income', query: reviewMode }}
          reviewElements={formatIncomeResponses(session.income)}
        />
      )}
      <ReviewCollection
        headerKey="ChooseClinic.title"
        editable={editable}
        editHref={{ pathname: '/choose-clinic', query: reviewMode }}
        reviewElements={formatClinicResponses(session.chooseClinic)}
      />
      <ReviewCollection
        headerKey="Contact.title"
        editable={editable}
        editHref={{ pathname: '/contact', query: reviewMode }}
        reviewElements={formatContactResponses(session.contact)}
      />
    </>
  )
}

export default ReviewSection
