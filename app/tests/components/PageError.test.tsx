import PageError from '@components/PageError'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<PageError alertBody="alert body text" />)
})
