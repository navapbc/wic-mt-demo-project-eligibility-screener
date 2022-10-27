import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import OtherBenefits from '@pages/other-benefits'

import * as sessionModule from '@src/hooks/useSessionStorage'
import { initialSessionData } from '@utils/sessionData'

import { setMockSession, setup } from '../helpers/setup'
import {
  testAccessibility,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/other-benefits'
const backRoute = '/eligibility'
const forwardRoute = '/'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  const { mockSession } = setup(route)
  testSnapshot(
    <OtherBenefits
      sessionKey="mockSessionKey"
      setSession={setMockSession}
      session={mockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <OtherBenefits
      sessionKey="mockSessionKey"
      setSession={setMockSession}
      session={mockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
})

it('should have a back link that matches the backRoute', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <OtherBenefits
      sessionKey="mockSessionKey"
      setSession={setMockSession}
      session={mockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />,
    backRoute
  )
})

it('should clear the session and redirect when the button is clicked', async () => {
  const { mockSession, user } = setup(route)
  // Spy on clearSessionStorage() to make sure it gets called.
  const spy = jest.spyOn(sessionModule, 'clearSessionStorage')
  render(
    <OtherBenefits
      sessionKey="mockSessionKey"
      setSession={setMockSession}
      session={mockSession}
      backRoute={backRoute}
      forwardRoute={forwardRoute}
    />
  )
  const button = screen.getByRole('button', { name: /Return/i })
  await user.click(button)

  expect(setMockSession).toHaveBeenCalledWith(initialSessionData)
  expect(singletonRouter).toMatchObject({ asPath: forwardRoute })
  expect(spy).toHaveBeenCalled()
})
