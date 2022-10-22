import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'

import { SessionData } from '@src/types'
import { hasRoutingIssues } from '@utils/routing'

import {
  getMockChooseClinicData,
  getMockContactData,
  getMockEligibilityData,
  getMockIncomeData,
} from '../../helpers/mockData'
import { getMockSession } from '../../helpers/setup'

interface RoutingTestCombo {
  validEligibility?: string
  adjunctiveMatch?: string
  validIncome?: string
  validChooseClinic?: string
  validContact?: string
  error: boolean
  cause: string
}

/**
 * Test setup
 */

beforeEach(() => {
  mockRouter.setCurrentUrl('/')
})

/**
 * /income requires:
 * - valid eligibility data
 *
 * /choose-clinic requires:
 * - valid income data if adjunctive includes 'none' AND
 * - valid eligibility data
 *
 * /contact requires:
 * - valid choose clinic data AND
 * - valid income data if adjunctive includes 'none' AND
 * - valid eligibility data
 *
 * /review requires:
 * - valid contact data AND
 * - valid choose clinic data AND
 * - valid income data if adjunctive includes 'none' AND
 * - valid eligibility data
 */
function buildRoutingIssuesMockSession(
  validEligibility: string = '',
  adjunctiveMatch: string = '',
  validIncome: string = '',
  validChooseClinic: string = '',
  validContact: string = ''
): SessionData {
  const mockSession = getMockSession()
  if (validEligibility === 'valid') {
    mockSession.eligibility = getMockEligibilityData()
  }

  if (adjunctiveMatch === 'none') {
    mockSession.eligibility.adjunctive = ['none']
  } else if (adjunctiveMatch === 'tanf') {
    mockSession.eligibility.adjunctive = ['tanf']
  }

  if (validIncome === 'valid') {
    mockSession.income = getMockIncomeData()
  }

  if (validChooseClinic === 'valid') {
    mockSession.chooseClinic = getMockChooseClinicData()
  }

  if (validContact === 'valid') {
    mockSession.contact = getMockContactData()
  }

  return mockSession
}

/**
 * Begin tests
 */

it('should have no issues on /', () => {
  const mockSession = getMockSession()
  const pathname = '/'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /how-it-works', () => {
  const mockSession = getMockSession()
  const pathname = '/how-it-works'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /eligibility', () => {
  const mockSession = getMockSession()
  const pathname = '/eligibility'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /confirmation', () => {
  const mockSession = getMockSession()
  const pathname = '/confirmation'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /other-benefits', () => {
  const mockSession = getMockSession()
  const pathname = '/other-benefits'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on unknown pages', () => {
  const mockSession = getMockSession()
  const pathname = '/unknown'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.error).toBe(false)
})

/**
 * Test routing for /income
 */
const incomePageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'invalid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'valid',
    error: false,
    cause: '',
  },
]
it.each(incomePageCombos)(
  '/income should have issues ($error caused by $cause) with $validEligibility eligibility',
  ({ validEligibility, error, cause }) => {
    const mockSession = buildRoutingIssuesMockSession(validEligibility)
    const pathname = '/income'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

const invalidChooseClinicPageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    error: true,
    cause: 'income',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    error: true,
    cause: 'eligibility',
  },
]
const validChooseClinicPageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    error: false,
    cause: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    error: false,
    cause: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    error: false,
    cause: '',
  },
]
const chooseClinicPageCombos = invalidChooseClinicPageCombos.concat(
  validChooseClinicPageCombos
)
it.each(chooseClinicPageCombos)(
  '/choose-clinic should have issues ($error caused by $cause) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income',
  ({ validEligibility, adjunctiveMatch, validIncome, error, cause }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome
    )
    const pathname = '/choose-clinic'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

/**
 * Test routing for /contact
 */
// If the previous pages are invalid, /contact will be invalid.
const contactValidPreviousInvalid: RoutingTestCombo[] =
  invalidChooseClinicPageCombos.map((combo) => ({
    ...combo,
    validChooseClinic: 'valid',
  }))
const contactInvalidPreviousInvalid: RoutingTestCombo[] =
  invalidChooseClinicPageCombos.map((combo) => ({
    ...combo,
    validChooseClinic: 'invalid',
  }))
// If the previous pages are invalid, but session.choose-clinic is invalid, then /contact will be invalid.
const contactInvalidPreviousValid: RoutingTestCombo[] =
  validChooseClinicPageCombos.map((combo) => ({
    ...combo,
    validChooseClinic: 'invalid',
    error: true,
    cause: 'choose-clinic',
  }))
// /contact will only be valid if the previous pages are valid AND session.choose-clinic is valid.
const validContactPageCombos: RoutingTestCombo[] =
  validChooseClinicPageCombos.map((combo) => ({
    ...combo,
    validChooseClinic: 'valid',
    error: false,
    cause: '',
  }))
// Combine into one testing array.
const invalidContactPageCombos = contactValidPreviousInvalid
  .concat(contactInvalidPreviousInvalid)
  .concat(contactInvalidPreviousValid)
const contactPageCombos = invalidContactPageCombos.concat(
  validContactPageCombos
)
it.each(contactPageCombos)(
  '/contact should have issues ($error caused by $cause) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    validChooseClinic,
    error,
    cause,
  }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome,
      validChooseClinic
    )
    const pathname = '/contact'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

/**
 * Test routing for /review
 */
// If the previous pages are invalid, /contact will be invalid.
const reviewValidPreviousInvalid: RoutingTestCombo[] =
  invalidContactPageCombos.map((combo) => ({
    ...combo,
    validContact: 'valid',
  }))
const reviewInvalidPreviousInvalid: RoutingTestCombo[] =
  invalidContactPageCombos.map((combo) => ({
    ...combo,
    validContact: 'invalid',
  }))
// If the previous pages are invalid, but session.contact is invalid, then /review will be invalid.
const reviewInvalidPreviousValid: RoutingTestCombo[] =
  validContactPageCombos.map((combo) => ({
    ...combo,
    validContact: 'invalid',
    error: true,
    cause: 'contact',
  }))
// /review will only be valid if the previous pages are valid AND session.contact is valid.
const validReviewPageCombos: RoutingTestCombo[] = validContactPageCombos.map(
  (combo) => ({
    ...combo,
    validContact: 'valid',
    error: false,
    cause: '',
  })
)
// Combine into one testing array.
const invalidReviewPageCombos = reviewValidPreviousInvalid
  .concat(reviewInvalidPreviousInvalid)
  .concat(reviewInvalidPreviousValid)
const reviewPageCombos = invalidReviewPageCombos.concat(validReviewPageCombos)
it.each(reviewPageCombos)(
  '/review should have issues ($error caused by $cause) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic $validContact contact',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    validChooseClinic,
    validContact,
    error,
    cause,
  }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome,
      validChooseClinic,
      validContact
    )
    const pathname = '/review'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)
