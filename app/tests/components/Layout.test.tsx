import { render } from '@testing-library/react'

import Layout from '@components/Layout'

import { testAccessibility } from '../helpers/sharedTests'

it('should match snapshot', () => {
  const { container } = render(<Layout children={<h1>'child'</h1>} />)
  expect(container).toMatchSnapshot()
})

it('should pass accessibility scan', async () => {
  await testAccessibility(<Layout children={<h1>'child'</h1>} />)
})
