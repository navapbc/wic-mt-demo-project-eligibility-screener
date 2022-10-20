import { SessionData } from '@src/types'
import { getBackRoute } from '@utils/routing'

import { getMockSession } from '../../helpers/setup'

const simplePaths = [
  ['/', ''],
  ['/how-it-works', '/'],
  ['/eligibility', '/how-it-works'],
  ['/income', '/eligibility'],
  ['/contact', '/choose-clinic'],
  ['/review', '/contact'],
  ['/confirmation', ''],
  ['/other-benefits', '/eligibility'],
]
it.each(simplePaths)('from %s it should route back to %s', (from, to) => {
  const mockSession = getMockSession()
  const backRoute = getBackRoute(from, mockSession)
  expect(backRoute).toBe(to)
})

it('from /choose-clinic it should route to /eligibility if there is qualifying adjunctive criteria', () => {
  const mockSession = getMockSession()
  mockSession.eligibility.adjunctive = ['tanf']
  const backRoute = getBackRoute('/choose-clinic', mockSession)
  expect(backRoute).toBe('/eligibility')
})

it('from /choose-clinic it should route to /income if there is no qualifying adjunctive criteria', () => {
  const mockSession = getMockSession()
  mockSession.eligibility.adjunctive = ['none']
  const backRoute = getBackRoute('/choose-clinic', mockSession)
  expect(backRoute).toBe('/income')
})

it('from /choose-clinic it should route to /income if adjunctive is empty', () => {
  const mockSession = getMockSession()
  const backRoute = getBackRoute('/choose-clinic', mockSession)
  expect(backRoute).toBe('/income')
})

it('should return empty string on an unknown page', () => {
  const mockSession = getMockSession()
  const backRoute = getBackRoute('/unknown', mockSession)
  expect(backRoute).toBe('')
})

it('should throw an error if a function is passed instead of a session on /choose-clinic', () => {
  expect(() => {
    function emptyFunction(value: SessionData): void {}
    getBackRoute('/choose-clinic', emptyFunction)
  }).toThrow('Back link error: expected a session, but none was found')
})
