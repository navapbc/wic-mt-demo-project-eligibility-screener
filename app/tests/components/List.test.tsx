import List from '@components/List'

import { testSnapshot } from '../helpers/sharedTests'

const testProps = {
  i18nKeys: ['list item a', 'list item b', 'list item c'],
}

it('should match snapshot', () => {
  testSnapshot(<List {...testProps} />)
})
