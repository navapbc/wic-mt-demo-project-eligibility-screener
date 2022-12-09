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
import { getEmptyMockSession } from '../../helpers/mockData'

interface RoutingTestCombo {
  validEligibility?: string
  adjunctiveMatch?: string
  validIncome?: string
  validChooseClinic?: string
  validContact?: string
  hasIssues: boolean
  showError: boolean
  redirect: string
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
  const mockSession = getEmptyMockSession()
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
  const mockSession = getEmptyMockSession()
  const pathname = '/'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.hasIssues).toBe(false)
  expect(outcome.showError).toBe(false)
})

it('should have no issues on /how-it-works', () => {
  const mockSession = getEmptyMockSession()
  const pathname = '/how-it-works'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.hasIssues).toBe(false)
  expect(outcome.showError).toBe(false)
})

it('should have no issues on /eligibility', () => {
  const mockSession = getEmptyMockSession()
  const pathname = '/eligibility'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.hasIssues).toBe(false)
  expect(outcome.showError).toBe(false)
})

it('should have no issues on /other-benefits', () => {
  const mockSession = getEmptyMockSession()
  const pathname = '/other-benefits'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.hasIssues).toBe(false)
  expect(outcome.showError).toBe(false)
})

it('should have no issues on unknown pages', () => {
  const mockSession = getEmptyMockSession()
  const pathname = '/unknown'
  singletonRouter.push(pathname)
  const outcome = hasRoutingIssues(pathname, mockSession)
  expect(outcome.hasIssues).toBe(false)
  expect(outcome.showError).toBe(false)
})

/**
 * Test for session error
 */
it('should throw an error if a function is passed instead of a session on a restricted page', () => {
  expect(() => {
    function emptyFunction(value: SessionData): void {}
    const pathname = '/income'
    singletonRouter.push(pathname)
    hasRoutingIssues(pathname, emptyFunction)
  }).toThrow('Routing error: expected a session, but none was found')
})

/**
 * Test routing for /income
 */
const incomePageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'invalid',
    hasIssues: true,
    showError: true,
    redirect: 'eligibility',
  },
  {
    validEligibility: 'valid',
    hasIssues: false,
    showError: false,
    redirect: '',
  },
]
it.each(incomePageCombos)(
  '/income should have issues ($hasIssues caused by $redirect) with $validEligibility eligibility',
  ({ validEligibility, hasIssues, showError, redirect }) => {
    const mockSession = buildRoutingIssuesMockSession(validEligibility)
    const pathname = '/income'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.hasIssues).toBe(hasIssues)
    expect(outcome.showError).toBe(showError)
    expect(outcome.redirect).toBe(redirect)
  }
)

const invalidChooseClinicPageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    hasIssues: true,
    showError: true,
    redirect: 'income',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'invalid',
    hasIssues: true,
    showError: true,
    redirect: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    hasIssues: true,
    showError: true,
    redirect: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    hasIssues: true,
    showError: true,
    redirect: 'eligibility',
  },
  {
    validEligibility: 'invalid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    hasIssues: true,
    showError: true,
    redirect: 'eligibility',
  },
]
const validChooseClinicPageCombos: RoutingTestCombo[] = [
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'none',
    validIncome: 'valid',
    hasIssues: false,
    showError: false,
    redirect: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'valid',
    hasIssues: false,
    showError: false,
    redirect: '',
  },
  {
    validEligibility: 'valid',
    adjunctiveMatch: 'tanf',
    validIncome: 'invalid',
    hasIssues: false,
    showError: false,
    redirect: '',
  },
]
const chooseClinicPageCombos = invalidChooseClinicPageCombos.concat(
  validChooseClinicPageCombos
)
it.each(chooseClinicPageCombos)(
  '/choose-clinic should have issues ($hasIssues caused by $redirect) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    hasIssues,
    showError,
    redirect,
  }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome
    )
    const pathname = '/choose-clinic'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.hasIssues).toBe(hasIssues)
    expect(outcome.showError).toBe(showError)
    expect(outcome.redirect).toBe(redirect)
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
    hasIssues: true,
    showError: true,
    redirect: 'choose-clinic',
  }))
// /contact will only be valid if the previous pages are valid AND session.choose-clinic is valid.
const validContactPageCombos: RoutingTestCombo[] =
  validChooseClinicPageCombos.map((combo) => ({
    ...combo,
    validChooseClinic: 'valid',
    hasIssues: false,
    showError: false,
    redirect: '',
  }))
// Combine into one testing array.
const invalidContactPageCombos = contactValidPreviousInvalid
  .concat(contactInvalidPreviousInvalid)
  .concat(contactInvalidPreviousValid)
const contactPageCombos = invalidContactPageCombos.concat(
  validContactPageCombos
)
it.each(contactPageCombos)(
  '/contact should have issues ($hasIssues caused by $redirect) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    validChooseClinic,
    hasIssues,
    showError,
    redirect,
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
    expect(outcome.hasIssues).toBe(hasIssues)
    expect(outcome.showError).toBe(showError)
    expect(outcome.redirect).toBe(redirect)
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
    hasIssues: true,
    showError: true,
    redirect: 'contact',
  }))
// /review will only be valid if the previous pages are valid AND session.contact is valid.
const validReviewPageCombos: RoutingTestCombo[] = validContactPageCombos.map(
  (combo) => ({
    ...combo,
    validContact: 'valid',
    hasIssues: false,
    showError: false,
    redirect: '',
  })
)
// Combine into one testing array.
const invalidReviewPageCombos = reviewValidPreviousInvalid
  .concat(reviewInvalidPreviousInvalid)
  .concat(reviewInvalidPreviousValid)
const reviewPageCombos = invalidReviewPageCombos.concat(validReviewPageCombos)
it.each(reviewPageCombos)(
  '/review should have issues ($hasIssues caused by $redirect) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic $validContact contact',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    validChooseClinic,
    validContact,
    hasIssues,
    showError,
    redirect,
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
    expect(outcome.hasIssues).toBe(hasIssues)
    expect(outcome.showError).toBe(showError)
    expect(outcome.redirect).toBe(redirect)
  }
)

// /confirmation is like /review except when it errors,
// it always redirects to / and never shows an error.
it.each(reviewPageCombos)(
  '/confirmation should have issues ($hasIssues caused by $redirect) with $validEligibility eligibility, adjunctive $adjunctiveMatch, $validIncome income, $validChooseClinic choose clinic $validContact contact',
  ({
    validEligibility,
    adjunctiveMatch,
    validIncome,
    validChooseClinic,
    validContact,
    hasIssues,
    showError,
    redirect,
  }) => {
    const mockSession = buildRoutingIssuesMockSession(
      validEligibility,
      adjunctiveMatch,
      validIncome,
      validChooseClinic,
      validContact
    )
    const pathname = '/confirmation'
    singletonRouter.push(pathname)
    const outcome = hasRoutingIssues(pathname, mockSession)
    expect(outcome.hasIssues).toBe(hasIssues)
    expect(outcome.showError).toBe(false)

    if (hasIssues) {
      expect(outcome.redirect).toBe('/')
    } else {
      expect(outcome.redirect).toBe('')
    }
  }
)
