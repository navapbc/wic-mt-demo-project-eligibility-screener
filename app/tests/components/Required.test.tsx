import Required from '@components/Required'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<Required />)
})
