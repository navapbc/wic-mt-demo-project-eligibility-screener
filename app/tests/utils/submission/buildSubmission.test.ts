import { buildSubmission, formatPhone } from '@utils/submission'

import { getMockIncomeData, getMockSessionData } from '../../helpers/mockData'

it('should build the expected object that does not include income data', () => {
  const mockSession = getMockSessionData()
  const submission = buildSubmission(mockSession)

  // Test session.eligibility.
  expect(submission.eligibility_categories).toBe(
    mockSession.eligibility.categorical
  )
  expect(submission.eligibility_programs).toBe(
    mockSession.eligibility.adjunctive
  )
  expect(submission.has_prior_wic_enrollment).toBe(
    mockSession.eligibility.previouslyEnrolled === 'yes'
  )

  // Test income.
  expect(submission.household_size).toBe(null)

  // Test choose clinic.
  expect(submission.zip_code).toBe(mockSession.chooseClinic.clinic?.zip)
  expect(submission.wic_clinic).toBe(mockSession.chooseClinic.clinic?.clinic)
  expect(submission.wic_agency).toBe(mockSession.chooseClinic.clinic?.agency)

  // Test contact.
  expect(submission.first_name).toBe(mockSession.contact.firstName)
  expect(submission.last_name).toBe(mockSession.contact.lastName)
  expect(submission.phone_number).toBe(formatPhone(mockSession.contact.phone))
  expect(submission.applicant_notes).toBe(mockSession.contact.comments)
})

it('should build the expected object that includes income data', () => {
  const mockSession = getMockSessionData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()

  const submission = buildSubmission(mockSession)
  expect(submission.household_size).toBe(
    parseInt(mockSession.income.householdSize)
  )
})

it('should exclude clinic data if it is undefined', () => {
  const mockSession = getMockSessionData()
  mockSession.chooseClinic.clinic = undefined

  const submission = buildSubmission(mockSession)
  expect(submission.zip_code).toBe('')
  expect(submission.wic_clinic).toBe('')
  expect(submission.wic_agency).toBe('')
})
