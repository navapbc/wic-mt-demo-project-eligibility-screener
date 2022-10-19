import type {
  ChooseClinicData,
  ContactData,
  EligibilityData,
  IncomeData,
} from '@src/types'

// Validation function for zip codes.
export function isValidZipCode(zipCode: string): boolean {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode)
}

// @TODO: tighten up validation to be only for acceptable keys
export function isValidEligibility(eligibility: EligibilityData): boolean {
  return (
    eligibility.residential !== '' &&
    eligibility.categorical.length > 0 &&
    eligibility.previouslyEnrolled !== '' &&
    eligibility.adjunctive.length > 0
  )
}

export function isValidIncome(income: IncomeData): boolean {
  return income.householdSize !== ''
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
