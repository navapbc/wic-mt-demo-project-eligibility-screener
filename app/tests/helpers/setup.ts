import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'

import type { SessionData } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

/*
 * Types
 */
// Return type taken from
// https://github.com/testing-library/user-event/pull/983#issuecomment-1185537044
type UserEventReturn = ReturnType<typeof userEvent['setup']>

interface SetupReturn {
  user: UserEventReturn
  mockSession: SessionData
}

/*
 * Mocks
 */

// A mock function for setSession()
export const setMockSession = jest.fn()

// Set the router to the default page path.
export function setupDefaultRoute(route: string): void {
  act(() => {
    mockRouter.setCurrentUrl(route)
  })
}

// Setup userEvent
// See https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
export function setupUserEvent(): UserEventReturn {
  // Set up userEvent
  const user = userEvent.setup()
  return user
}

export function getEmptyMockSession(): SessionData {
  return cloneDeep(initialSessionData)
}

// Setup function using AHA principle.
// See https://kentcdodds.com/blog/avoid-nesting-when-youre-testing#apply-aha-avoid-hasty-abstractions
export function setup(route: string): SetupReturn {
  setupDefaultRoute(route)

  // Reset the mock session before each test.
  const mockSession = getEmptyMockSession()

  return {
    user: setupUserEvent(),
    mockSession: mockSession,
  }
}
