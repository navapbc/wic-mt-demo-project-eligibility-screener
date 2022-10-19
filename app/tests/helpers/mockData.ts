import type { SessionData } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

// Helper function to setup a fully filled out session.
export function fillMockSessionData(mockSession: SessionData) {
  mockSession.eligibility = {
    residential: 'yes',
    categorical: ['pregnant', 'guardian'],
    previouslyEnrolled: 'no',
    adjunctive: ['fdpir', 'snap'],
  }

  mockSession.chooseClinic = {
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

  mockSession.contact = {
    firstName: 'Jack',
    lastName: 'O Lantern',
    phone: '1231231234',
    comments: 'comments',
  }

  return mockSession
}
