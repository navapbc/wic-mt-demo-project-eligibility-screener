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
const incomeRoutingCombos: RoutingTestCombo[] = [
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
it.each(incomeRoutingCombos)(
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

const chooseClinicRoutingCombos: RoutingTestCombo[] = [
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
    cause: 'income',
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
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    error: true,
    cause: 'eligibility',
  },
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
it.each(chooseClinicRoutingCombos)(
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
// No matter what the other data combinations, if session.chooseClinic is invalid, then /contact should error.
const invalidContactCombos: RoutingTestCombo[] = chooseClinicRoutingCombos.map(
  (combo) => ({
    ...combo,
    validChooseClinic: 'invalid',
    error: true,
    cause: 'choose-clinic',
  })
)
// If session.chooseClinic is valid, then the outcome should match the outcomes for testing /choose-clinic.
const validContactCombos: RoutingTestCombo[] = chooseClinicRoutingCombos.map(
  (combo) => ({ ...combo, validChooseClinic: 'valid' })
)
// Combine into one testing array.
const contactCombos = invalidContactCombos.concat(validContactCombos)
it.each(contactCombos)(
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
// No matter what the other data combinations, if session.contact is invalid, then /review should error.
const invalidReviewCombos: RoutingTestCombo[] = contactCombos.map((combo) => ({
  ...combo,
  validContact: 'invalid',
  error: true,
  cause: 'contact',
}))
// If session.contact is valid, then the outcome should match the outcomes for testing /contact.
const validReviewCombos: RoutingTestCombo[] = contactCombos.map((combo) => ({
  ...combo,
  validContact: 'valid',
}))
// Combine into one testing array.
const reviewCombos = invalidReviewCombos.concat(validReviewCombos)
it.each(reviewCombos)(
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
