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
