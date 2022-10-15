import HowItWorks from '@pages/how-it-works'

import { setup } from '../helpers/setup'
import { testAccessibility, testSnapshot } from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/how-it-works'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  testSnapshot(<HowItWorks />)
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(<HowItWorks />)
})
