import Layout from '@components/Layout'

import { testAccessibility, testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<Layout children={<h1>'child'</h1>} />)
})

it('should pass accessibility scan', async () => {
  await testAccessibility(<Layout children={<h1>'child'</h1>} />)
})
