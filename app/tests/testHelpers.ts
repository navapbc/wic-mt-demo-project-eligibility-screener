import type { EligibilityData, SessionData } from '@customTypes/common'
import cloneDeep from 'lodash/cloneDeep'

// Mock the session
export const emptyMockEligibility: EligibilityData = {
  residential: '',
  categorical: [],
  previouslyEnrolled: '',
  adjunctive: [],
}

export const emptyMockSession: SessionData = {
  chooseClinic: {
    clinic: undefined,
    zipCode: '',
  },
  contact: {
    firstName: '',
    lastName: '',
    phone: '',
    comments: '',
  },
  eligibility: cloneDeep(emptyMockEligibility),
  income: {
    householdSize: '',
  },
}

export const setMockSession = jest.fn()
