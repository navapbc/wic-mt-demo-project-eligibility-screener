import { render, screen } from '@testing-library/react'

import BackLink from '@components/BackLink'

it('should match snapshot', () => {
  const { container } = render(<BackLink href="/" />)
  expect(container).toMatchSnapshot()
})
