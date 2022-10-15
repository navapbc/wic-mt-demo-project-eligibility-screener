import { act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import cloneDeep from 'lodash/cloneDeep'
import mockRouter from 'next-router-mock'

import type { SessionData } from '@src/types'
import { initialSessionData } from '@utils/sessionData'

// Types
type SetupReturn = {
  user: ReturnType<typeof userEvent['setup']>
  mockSession: SessionData
}

// A mock function for setSession()
export const setMockSession = jest.fn()

// Set the router to the default page path.
export function setupDefaultRoute(route: string): void {
  act(() => {
    mockRouter.setCurrentUrl(route)
  })
}

// Setup function using AHA principle.
// See https://kentcdodds.com/blog/avoid-nesting-when-youre-testing#apply-aha-avoid-hasty-abstractions
// Return type taken from
// https://github.com/testing-library/user-event/pull/983#issuecomment-1185537044
export function setup(route: string): SetupReturn {
  setupDefaultRoute(route)

  // Reset the mock session before each test.
  const mockSession = cloneDeep(initialSessionData)

  // Set up userEvent
  // See https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
  const user = userEvent.setup()

  return {
    user: user,
    mockSession: mockSession,
  }
}
