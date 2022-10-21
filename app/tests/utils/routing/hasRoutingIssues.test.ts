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

/**
 * Test setup
 */

beforeEach(() => {
  mockRouter.setCurrentUrl('/')
})

/**
 * Begin tests
 */

it('should have no issues on /', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /how-it-works', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/how-it-works')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /eligibility', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/eligibility')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /confirmation', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/confirmation')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on /other-benefits', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/other-benefits')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

it('should have no issues on unknown pages', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/unknown')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
})

/**
 * /income requires:
 * - valid eligibility data
 *
 * /choose-clinic requires:
 * - valid income data if adjunctive includes 'none' AND
 * - valid eligibility data
 */
function buildRoutingIssuesMockSession(
  validEligibility: string = '',
  adjunctiveMatch: string = '',
  validIncome: string = '',
  validChooseClinic: string = '',
  validContact: string = '',
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
 * Test routing for /income
 */
const incomeRoutingCombos = [
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
    singletonRouter.push('/income')
    const outcome = hasRoutingIssues(singletonRouter, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

const chooseClinicRoutingCombos = [
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
    singletonRouter.push('/choose-clinic')
    const outcome = hasRoutingIssues(singletonRouter, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

/**
 * Test routing for /contact
 */
const contactRoutingCombos = [
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    validChooseClinic: 'invalid',
    error: true,
    cause: 'chooseClinic',
  },
    {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    validChooseClinic: 'valid',
    error: true,
    cause: 'income',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    validChooseClinic: 'valid',
    error: true,
    cause: 'income',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    validChooseClinic: 'valid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    validChooseClinic: 'valid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    validChooseClinic: 'valid',
    error: true,
    cause: 'eligibility',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    validChooseClinic: 'valid',
    error: false,
    cause: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    validChooseClinic: 'valid',
    error: false,
    cause: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    validChooseClinic: 'valid',
    error: false,
    cause: '',
  },
]
it.each(contactRoutingCombos)(
  '/contact should have issues ($error caused by $cause) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic',
  ({ validEligibility, adjunctiveMatch, validIncome, validChooseClinic, error, cause }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome,
      validChooseClinic
    )
    singletonRouter.push('/contact')
    const outcome = hasRoutingIssues(singletonRouter, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

/**
 * Test routing for /review
 */
const reviewRoutingCombos = [
{
  validEligibility: 'valid',
  adjunctiveMatch: 'tanf',
  validIncome: 'invalid',
  validChooseClinic: 'valid',
  validContact: 'valid',
  error: false,
  cause: '',
},
]
it.each(reviewRoutingCombos)(
  '/review should have issues ($error caused by $cause) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic, $validContact contact',
  ({ validEligibility, adjunctiveMatch, validIncome, validChooseClinic, validContact, error, cause }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome,
      validChooseClinic,
      validContact
    )
    singletonRouter.push('/review')
    const outcome = hasRoutingIssues(singletonRouter, mockSession)
    expect(outcome.error).toBe(error)
    expect(outcome.cause).toBe(cause)
  }
)

/*
// /review requires:
// - valid contact data AND
// - valid choose clinic data AND
// - valid income data if adjunctive includes 'none' AND
// - valid eligibility data
it('should have issues on /review with invalid contact', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(true)
  expect(outcome.cause).toBe('contact')
})

it('should have issues on /review with valid contact, invalid choose clinic', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(true)
  expect(outcome.cause).toBe('chooseClinic')
})

it('should have issues on /review with valid contact, valid choose clinic, adjunctive none, invalid income', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(true)
  expect(outcome.cause).toBe('income')
})

it('should have issues on /review with valid contact, valid choose clinic, adjunctive, valid income, invalid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(true)
  expect(outcome.cause).toBe('eligibility')
})

it('should have no issues on /review with valid, contact, valid choose clinic, adjunctive none, valid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
  expect(outcome.cause).toBe('')
})

it('should have no issues on /review with valid, contact, valid choose clinic, valid choose clinic, adjunctive, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
  expect(outcome.cause).toBe('')
})

it('should have no issues on /review with valid, contact, valid choose clinic, adjunctive, invalid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/review')
  const outcome = hasRoutingIssues(singletonRouter, mockSession)
  expect(outcome.error).toBe(false)
  expect(outcome.cause).toBe('')
})
*/
