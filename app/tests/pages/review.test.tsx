import { render, screen } from '@testing-library/react'

import Review from '@pages/review'

import { getMockSessionData } from '../helpers/mockData'
import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonRoute,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/review'
const backRoute = '/contact'
const forwardRoute = '/confirmation'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  const mockSession = getMockSessionData()
  testSnapshot(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('should have a back link that matches the backRoute', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    backRoute
  )
})

it('should have an action button that routes to forwardRoute', async () => {
  const { mockSession, user } = setup(route)
  const element = (
    <Review
      session={mockSession}
      setSession={setMockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
  await testActionButtonRoute(element, forwardRoute, 'Submit', user)
})
