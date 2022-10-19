import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Review from '@pages/review'

import { fillMockSessionData } from '../helpers/mockData'
import { setup } from '../helpers/setup'
import {
  testAccessibility,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/review'

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

it('should have a back link to /contact', () => {
  const { mockSession } = setup(route)
  testBackLink(<Review session={mockSession} />, '/contact')
})

it('should route to /confirmation', async () => {
  const { mockSession, user } = setup(route)
  render(<Review session={mockSession} />)

  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
})
