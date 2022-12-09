import cloneDeep from 'lodash/cloneDeep'

import { getEmptyMockSession, getMockSessionData } from '@lib/mockData'
import { isValidSession } from '@utils/dataValidation'
import {
  initialChooseClinicData,
  initialContactData,
  initialEligibilityData,
  initialIncomeData,
  initialSessionData,
} from '@utils/sessionData'

const topLevel = Object.keys(initialSessionData).map((x) => [x])
it.each(topLevel)('should return false if %s is undefined', (attr) => {
  const mockSession = getEmptyMockSession()
  // @ts-ignore
  delete mockSession[attr]
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(false)
})

const eligibility = Object.keys(initialEligibilityData).map((x) => [
  'eligibility',
  x,
])
const income = Object.keys(initialIncomeData).map((x) => ['income', x])
const chooseClinic = Object.keys(initialChooseClinicData).map((x) => [
  'chooseClinic',
  x,
])
const contact = Object.keys(initialContactData).map((x) => ['contact', x])
const combined = eligibility.concat(income).concat(chooseClinic).concat(contact)

it.each(combined)(
  'should return false if %s.%s is undefined',
  (topLevel, attr) => {
    const mockSession = getEmptyMockSession()
    // @ts-ignore
    delete mockSession[topLevel][attr]
    const outcome = isValidSession(mockSession)
    expect(outcome).toBe(false)
  }
)

it('should return false if eligibility is invalid', () => {
  const mockSession = getMockSessionData()
  mockSession.eligibility = cloneDeep(initialEligibilityData)
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(false)
})

it('should return false if income is invalid and adjunctive is none', () => {
  const mockSession = getMockSessionData()
  mockSession.eligibility.adjunctive = ['none']
  mockSession.income = cloneDeep(initialIncomeData)
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(false)
})

it('should return true if income is invalid and adjunctive is not none', () => {
  const mockSession = getMockSessionData()
  mockSession.eligibility.adjunctive = ['fdpir']
  mockSession.income = cloneDeep(initialIncomeData)
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(true)
})

it('should return false if chooseClinic is invalid', () => {
  const mockSession = getMockSessionData()
  mockSession.chooseClinic = cloneDeep(initialChooseClinicData)
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(false)
})

it('should return false if contact is invalid', () => {
  const mockSession = getMockSessionData()
  mockSession.contact = cloneDeep(initialContactData)
  const outcome = isValidSession(mockSession)
  expect(outcome).toBe(false)
})
