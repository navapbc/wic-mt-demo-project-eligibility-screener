import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Review from '@pages/review'

import type { SessionData } from '@src/types'

import { setup } from '../helpers/setup'
import { testAccessibility, testSnapshot } from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/review'
function fillMockSessionData(mockSession: SessionData) {
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
    phone: '123-123-1234',
    comments: 'comments',
  }

  return mockSession
}

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  let { mockSession } = setup(route)
  mockSession = fillMockSessionData(mockSession)
  testSnapshot(<Review session={mockSession} />)
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(<Review session={mockSession} />)
})

it('should route to /confirmation', async () => {
  const { mockSession, user } = setup(route)
  render(<Review session={mockSession} />)

  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
})
