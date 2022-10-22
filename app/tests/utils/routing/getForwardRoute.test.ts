import { SessionData } from '@src/types'
import { getForwardRoute } from '@utils/routing'

import {
  getMockEligibilityData,
  getMockIncomeData,
} from '../../helpers/mockData'
import { getMockSession } from '../../helpers/setup'

const simplePaths = [
  ['/', '/how-it-works'],
  ['/how-it-works', '/eligibility'],
  ['/income', '/choose-clinic'],
  ['/choose-clinic', '/contact'],
  ['/contact', '/review'],
  ['/review', '/confirmation'],
  ['/confirmation', ''],
  ['/other-benefits', '/'],
]
it.each(simplePaths)('from %s it should route forward to %s', (from, to) => {
  const mockSession = getMockSession()
  const forwardRoute = getForwardRoute(from, false, mockSession)
  expect(forwardRoute).toBe(to)
})

const simpleReviewPaths = [['/income'], ['/choose-clinic'], ['/contact']]
it.each(simpleReviewPaths)(
  'from %s?mode=review it should route forward to /review',
  (from) => {
    const mockSession = getMockSession()
    const forwardRoute = getForwardRoute(from, true, mockSession)
    expect(forwardRoute).toBe('/review')
  }
)

it('from /eligibility?mode=review it should route to /review if there is qualifying adjunctive criteria', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/review')
})

it('should return empty string on an unknown page', () => {
  const mockSession = getMockSession()
  const forwardRoute = getForwardRoute('/unknown', false, mockSession)
  expect(forwardRoute).toBe('')
})

it('from /eligibility it should route to /choose-clinic if there is qualifying adjunctive criteria', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/choose-clinic')
})

it('from /eligibility it should route to /income if there is no qualifying adjunctive criteria', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/income')
})

it('from /eligibility it should route to /other-benefits if residential is not met, but categorical is met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.residential = 'no'
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility it should route to /other-benefits if residential is met, but categorical is not met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.categorical = ['none']
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility it should route to /other-benefits if residential is not met and categorical is not met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.residential = 'no'
  mockSession.eligibility.categorical = ['none']
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility it should route to /other-benefits if invalid eligibility', () => {
  const mockSession = getMockSession()
  const forwardRoute = getForwardRoute('/eligibility', false, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility?mode=review it should route to /income?mode=review if there is no qualifying adjunctive criteria and invalid income', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toStrictEqual({
    pathname: '/income',
    query: { mode: 'review' },
  })
})

it('from /eligibility?mode=review it should route to /income?mode=review if there is no qualifying adjunctive criteria and valid income', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/review')
})

it('from /eligibility?mode=review it should route to /other-benefits if residential is not met, but categorical is met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.residential = 'no'
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility?mode=review it should route to /other-benefits if residential is met, but categorical is not met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.categorical = ['none']
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility?mode=review it should route to /other-benefits if residential is not met and categorical is not met', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.residential = 'no'
  mockSession.eligibility.categorical = ['none']
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('from /eligibility?mode=review it should route to /other-benefits if requirements are not met', () => {
  const mockSession = getMockSession()
  const forwardRoute = getForwardRoute('/eligibility', true, mockSession)
  expect(forwardRoute).toBe('/other-benefits')
})

it('should throw an error if a function is passed instead of a session on /eligibility', () => {
  expect(() => {
    function emptyFunction(value: SessionData): void {}
    getForwardRoute('/eligibility', false, emptyFunction)
  }).toThrow('Forward route error: expected a session, but none was found')
})
