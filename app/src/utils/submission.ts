// Note: This util is meant to run serverside.
import cloneDeep from 'lodash/cloneDeep'

import { SessionData } from '@src/types'

// Note: The snake case of these attributes is intention and meant to match
//       the API fields exactly.
export type Submission = {
  eligibility_categories: string[]
  eligibility_programs: string[]
  has_prior_wic_enrollment: boolean
  household_size: number | null
  zip_code: string
  wic_clinic: string
  wic_agency: string
  first_name: string
  last_name: string
  phone_number: string
  applicant_notes: string
}

export const initialSubmissionData: Submission = {
  eligibility_categories: [],
  eligibility_programs: [],
  has_prior_wic_enrollment: false,
  household_size: null,
  zip_code: '',
  wic_clinic: '',
  wic_agency: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  applicant_notes: '',
}

// Modified from https://stackoverflow.com/a/8358141
export function formatPhone(phone: string) {
  const stripNonNumbers = ('' + phone).replace(/\D/g, '')
  const match = stripNonNumbers.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return ''
}

export function buildSubmission(session: SessionData) {
  const submission: Submission = cloneDeep(initialSubmissionData)

  // Build eligibility data.
  // Note: eligibility_categories & eligibility_programs are pre-processed
  //       using t() to map the key to the user-facing content.
  submission.eligibility_categories = session.eligibility.categorical
  submission.eligibility_programs = session.eligibility.adjunctive
  submission.has_prior_wic_enrollment =
    session.eligibility.previouslyEnrolled === 'yes'

  // Build income data.
  if (
    !session.eligibility.adjunctive.includes('none') &&
    session.income.householdSize !== ''
  ) {
    submission.household_size = parseInt(session.income.householdSize)
  }
  submission.household_size = 'onetuhno'

  // Build choose clinic data.
  if (session.chooseClinic.clinic !== undefined) {
    submission.zip_code = session.chooseClinic.clinic.zip
    submission.wic_clinic = session.chooseClinic.clinic.clinic
    submission.wic_agency = session.chooseClinic.clinic.agency
  }

  // Build contact data.
  submission.first_name = session.contact.firstName
  submission.last_name = session.contact.lastName
  submission.phone_number = formatPhone(session.contact.phone)
  submission.applicant_notes = session.contact.comments

  return submission
}
