import Index from '@pages/index'

import { setup } from '../helpers/setup'
import {
  testAccessibility,
  testActionButtonRoute,
  testSnapshot,
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
  testSnapshot(<Index forwardRoute={forwardRoute} />)
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(<Index forwardRoute={forwardRoute} />)
})

it('should have an action button that routes to /how-it-works', async () => {
  const { mockSession, user } = setup(route)
  const element = <Index forwardRoute={forwardRoute} />
  testActionButtonRoute(element, '/how-it-works', 'Started', user)
})
