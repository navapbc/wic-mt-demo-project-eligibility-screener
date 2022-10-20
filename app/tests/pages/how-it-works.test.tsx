import HowItWorks from '@pages/how-it-works'

import { setup } from '../helpers/setup'
import {
  testAccessibility,
  testBackLink,
  testSnapshot,
} from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/how-it-works'
const backRoute = '/'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  testSnapshot(<HowItWorks backRoute={backRoute} />)
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(<HowItWorks backRoute={backRoute} />)
})

it('should have a back link that matches the backRoute', () => {
  testBackLink(<HowItWorks backRoute={backRoute} />, backRoute)
})
