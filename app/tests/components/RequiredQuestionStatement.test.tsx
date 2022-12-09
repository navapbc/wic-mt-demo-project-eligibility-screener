import { render } from '@testing-library/react'

import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

it('should match snapshot', () => {
  const { container } = render(<RequiredQuestionStatement />)
  expect(container).toMatchSnapshot()
})
