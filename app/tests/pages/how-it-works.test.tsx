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
const forwardRoute = '/eligibility'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  testSnapshot(<HowItWorks backRoute={backRoute} forwardRoute={forwardRoute} />)
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(
    <HowItWorks backRoute={backRoute} forwardRoute={forwardRoute} />
  )
})
