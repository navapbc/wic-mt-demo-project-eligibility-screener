import incomeData from '@public/data/income.json'

import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
  SessionData,
} from '@src/types'
import {
  initialChooseClinicData,
  initialContactData,
  initialEligibilityData,
  initialIncomeData,
  initialSessionData,
} from '@utils/sessionData'

// Validation function for zip codes.
export function isValidZipCode(zipCode: string): boolean {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode)
}

export const validEligibilityOptions = {
  residential: ['yes', 'no'],
  categorical: ['pregnant', 'baby', 'child', 'guardian', 'loss', 'none'],
  previouslyEnrolled: ['yes', 'no'],
  adjunctive: ['insurance', 'snap', 'tanf', 'fdpir', 'none'],
}

export function isValidEligibility(eligibility: EligibilityData): boolean {
  return (
    validEligibilityOptions.residential.includes(eligibility.residential) &&
    eligibility.categorical.length > 0 &&
    eligibility.categorical.every((item) =>
      validEligibilityOptions.categorical.includes(item)
    ) &&
    validEligibilityOptions.previouslyEnrolled.includes(
      eligibility.previouslyEnrolled
    ) &&
    eligibility.adjunctive.length > 0 &&
    eligibility.adjunctive.every((item) =>
      validEligibilityOptions.adjunctive.includes(item)
    )
  )
}

export function isValidIncome(income: IncomeData): boolean {
  return Object.keys(incomeData).includes(income.householdSize)
}

export function isValidChooseClinic(chooseClinic: ChooseClinicData): boolean {
  return (
    chooseClinic.zipCode !== '' &&
    isValidZipCode(chooseClinic.zipCode) &&
    chooseClinic.clinic !== undefined
  )
}

export function isValidContact(contact: ContactData): boolean {
  return (
    contact.firstName !== '' &&
    contact.lastName !== '' &&
    contact.phone !== '' &&
    contact.phone.replace(/[^0-9]/g, '').length === 10
  )
}

// This function explicitly disables some eslint checks because it is
// meant to catch runtime checks that typescript cannot catch.
function isDefined(
  dataType:
    | SessionData
    | EligibilityData
    | IncomeData
    | ContactData
    | ChooseClinicData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): boolean {
  for (const attr in dataType) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data[attr] === undefined) {
      return false
    }
  }
  return true
}

export function isValidSession(session: SessionData): boolean {
  const checks = [
    { dataType: initialSessionData, data: session },
    { dataType: initialEligibilityData, data: session.eligibility },
    { dataType: initialIncomeData, data: session.income },
    { dataType: initialChooseClinicData, data: session.chooseClinic },
    { dataType: initialContactData, data: session.contact },
  ]

  for (let i = 0, len = checks.length; i < len; i++) {
    if (!isDefined(checks[i].dataType, checks[i].data)) {
      return false
    }
  }

  if (!isValidEligibility(session.eligibility)) {
    return false
  }

  // This is a complicated bit of business logic. Basically, in order to be eligible for WIC,
  // an applicant must EITHER have "adjunctive eligibility" by being enrolled in another
  // qualifying program, such as medicaid, SNAP, or TANF, OR they must meet income requirements.
  // Having valid income data only matters if the applicant has selected "none of the above"
  // for the "do you have adjunctive eligibility" (paraphrase) question.
  if (
    session.eligibility.adjunctive.includes('none') &&
    !isValidIncome(session.income)
  ) {
    return false
  }

  if (!isValidChooseClinic(session.chooseClinic)) {
    return false
  }

  if (!isValidContact(session.contact)) {
    return false
  }

  return true
}
