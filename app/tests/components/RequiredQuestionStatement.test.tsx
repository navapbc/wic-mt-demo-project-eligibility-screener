import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<RequiredQuestionStatement />)
})
