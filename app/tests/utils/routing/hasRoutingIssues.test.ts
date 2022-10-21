import mockRouter from 'next-router-mock'
import singletonRouter from 'next/router'

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

it('should have no issues on /', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /how-it-works', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/how-it-works')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /eligibility', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/eligibility')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /confirmation', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/confirmation')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /other-benefits', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/other-benefits')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on unknown pages', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/unknown')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

// /income requires:
// - valid eligibility data
it('should have issues on /income with invalid eligibility', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/income')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have no issues on /income with valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/income')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

// /choose-clinic requires:
// - valid income data if adjunctive includes 'none' AND
// - valid eligibility data
it('should have issues on /choose-clinic with adjunctive none, invalid income', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  singletonRouter.push('/choose-clinic')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /choose-clinic with adjunctive, valid income, invalid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.eligibility.adjunctive = ['tanf']
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/choose-clinic')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have no issues on /choose-clinic with adjunctive none, valid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/choose-clinic')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /choose-clinic with adjunctive, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/choose-clinic')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /choose-clinic with adjunctive, invalid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/choose-clinic')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

// /contact requires:
// - valid choose clinic data AND
// - valid income data if adjunctive includes 'none' AND
// - valid eligibility data
it('should have issues on /contact with invalid choose clinic', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /contact with valid choose clinic, adjunctive none, invalid income', () => {
  const mockSession = getMockSession()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /contact with valid choose clinic, adjunctive, valid income, invalid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have no issues on /contact with valid choose clinic, adjunctive none, valid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /contact with valid choose clinic, valid choose clinic, adjunctive, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /contact with valid choose clinic, adjunctive, invalid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

// /review requires:
// - valid contact data AND
// - valid choose clinic data AND
// - valid income data if adjunctive includes 'none' AND
// - valid eligibility data
it('should have issues on /review with invalid contact', () => {
  const mockSession = getMockSession()
  singletonRouter.push('/contact')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /review with valid contact, invalid choose clinic', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /review with valid contact, valid choose clinic, adjunctive none, invalid income', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have issues on /review with valid contact, valid choose clinic, adjunctive, valid income, invalid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(true)
})

it('should have no issues on /review with valid, contact, valid choose clinic, adjunctive none, valid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = getMockIncomeData()
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /review with valid, contact, valid choose clinic, valid choose clinic, adjunctive, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})

it('should have no issues on /review with valid, contact, valid choose clinic, adjunctive, invalid income, valid eligibility', () => {
  const mockSession = getMockSession()
  mockSession.contact = getMockContactData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.eligibility = getMockEligibilityData()
  singletonRouter.push('/review')
  expect(hasRoutingIssues(singletonRouter, mockSession)).toBe(false)
})
