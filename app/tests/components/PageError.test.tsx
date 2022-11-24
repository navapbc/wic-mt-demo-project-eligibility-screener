import { render } from '@testing-library/react'

import PageError from '@components/PageError'

it('should match snapshot', () => {
  const { container } = render(<PageError alertBody="alert body text" />)
  expect(container).toMatchSnapshot()
})
