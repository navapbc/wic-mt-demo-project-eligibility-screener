import { render } from '@testing-library/react'

import Index from '@pages/index'

import { setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonRoute,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/'
const forwardRoute = '/how-it-works'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  const { container } = render(<Index forwardRoute={forwardRoute} />)
  expect(container).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(<Index forwardRoute={forwardRoute} />)
})

it('should have an action button that routes to forwardRoute', async () => {
  const { mockSession, user } = setup(route)
  const element = <Index forwardRoute={forwardRoute} />
  await testActionButtonRoute(element, forwardRoute, 'Started', user)
})
