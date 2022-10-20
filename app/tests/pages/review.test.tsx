import { render, screen } from '@testing-library/react'
import singletonRouter from 'next/router'

import Review from '@pages/review'

import { getMockSessionData } from '../helpers/mockData'
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
const backRoute = '/contact'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  const mockSession = getMockSessionData()
  testSnapshot(<Review session={mockSession} backRoute={backRoute} />)
})

it('should pass accessibility scan', async () => {
  const { mockSession } = setup(route)
  await testAccessibility(
    <Review session={mockSession} backRoute={backRoute} />
  )
})

it('should have a back link that matches the backRoute', () => {
  const { mockSession } = setup(route)
  testBackLink(
    <Review session={mockSession} backRoute={backRoute} />,
    backRoute
  )
})

it('should route to /confirmation', async () => {
  const { mockSession, user } = setup(route)
  render(<Review session={mockSession} backRoute={backRoute} />)

  const button = screen.getByRole('button', { name: /Submit/i })
  await user.click(button)
  expect(singletonRouter).toMatchObject({ asPath: '/confirmation' })
})
