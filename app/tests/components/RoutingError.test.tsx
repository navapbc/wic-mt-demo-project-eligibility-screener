import RoutingError from '@components/RoutingError'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<RoutingError />)
})
