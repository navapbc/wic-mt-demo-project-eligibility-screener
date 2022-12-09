import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Confirmation from '@pages/confirmation'

import * as sessionModule from '@src/hooks/useSessionStorage'
import { initialSessionData } from '@utils/sessionData'

import { setMockSession, setup } from '../helpers/setup'
import { testAccessibility } from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/confirmation'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  const { container } = render(
    <Confirmation
      sessionKey="mockSessionKey"
      session={mockSession}
      setSession={setMockSession}
    />
  )
  expect(container).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Confirmation
      sessionKey="mockSessionKey"
      session={mockSession}
      setSession={setMockSession}
    />
  )
})

it('should clear the session and redirect when start new application button is clicked', async () => {
  const { mockSession, user } = setup(route)
  // Spy on clearSessionStorage() to make sure it gets called.
  const spy = jest.spyOn(sessionModule, 'clearSessionStorage')
  render(
    <Confirmation
      sessionKey="mockSessionKey"
      session={mockSession}
      setSession={setMockSession}
    />
  )

  const button = screen.getByRole('button', { name: /Start/i })
  await user.click(button)

  expect(setMockSession).toHaveBeenCalledWith(initialSessionData)
  expect(singletonRouter).toMatchObject({ asPath: '/' })
  expect(spy).toHaveBeenCalled()
})
