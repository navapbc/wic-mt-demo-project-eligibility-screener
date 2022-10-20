// Note: This file is loaded by Storybook.
// Don't directly call jest in it.
import cloneDeep from 'lodash/cloneDeep'

import type { SessionData } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

// Helper functions to create valid data for each section of the session.
export function getMockEligibilityData() {
  return {
    residential: 'yes',
    categorical: ['pregnant', 'guardian'],
    previouslyEnrolled: 'no',
    adjunctive: ['fdpir', 'snap'],
  }
}

export function getMockChooseClinicData() {
  return {
    zipCode: '12345',
    clinic: {
      agency: 'AGENCY ZERO',
      agencyAddress: '0000 St, Helena, MT 00000',
      agencyTelephone: '(000) 000-0000',
      clinic: 'CLINIC ZERO',
      clinicAddress: '0000 St, Helena, MT 00000',
      clinicTelephone: '(000) 000-0000',
      county: 'COUNTY ZERO',
      id: 0,
      zip: '00000',
    },
  }
}

export function getMockContactData() {
  return {
    firstName: 'Jack',
    lastName: 'O Lantern',
    phone: '1231231234',
    comments: 'comments',
  }
}

// Helper function to setup a fully filled out session.
export function getMockSessionData() {
  const mockSession = cloneDeep(initialSessionData)
  mockSession.eligibility = getMockEligibilityData()
  mockSession.chooseClinic = getMockChooseClinicData()
  mockSession.contact = getMockContactData()
  return mockSession
}
