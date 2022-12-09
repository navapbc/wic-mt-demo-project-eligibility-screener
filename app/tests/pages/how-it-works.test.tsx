import { render } from '@testing-library/react'

import HowItWorks from '@pages/how-it-works'

import { setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonRoute,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/how-it-works'
const backRoute = '/'
const forwardRoute = '/eligibility'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  const { container } = render(
    <HowItWorks backRoute={backRoute} forwardRoute={forwardRoute} />
  )
  expect(container).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(
    <HowItWorks backRoute={backRoute} forwardRoute={forwardRoute} />
  )
})

it('should have an action button that routes to forwardRoute', async () => {
  const { mockSession, user } = setup(route)
  const element = (
    <HowItWorks backRoute={backRoute} forwardRoute={forwardRoute} />
  )
  await testActionButtonRoute(element, forwardRoute, 'Check', user)
})
