import { render } from '@testing-library/react'

import Required from '@components/Required'

it('should match snapshot', () => {
  const { container } = render(<Required />)
  expect(container).toMatchSnapshot()
})
