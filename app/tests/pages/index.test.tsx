import Index from '@pages/index'

import { setup } from '../helpers/setup'
import { testAccessibility, testSnapshot } from '../helpers/sharedTests'

/**
 * Test setup
 */

const route = '/'

/**
 * Begin tests
 */

it('should match full page snapshot', () => {
  setup(route)
  testSnapshot(<Index />)
})

it('should pass accessibility scan', async () => {
  setup(route)
  await testAccessibility(<Index />)
})
