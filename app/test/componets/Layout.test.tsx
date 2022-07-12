// test/pages/index.test.js
import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Layout from '@components/Layout'

import renderWithIntl from '../renderWithIntl'

describe('Layout', () => {
  it('should render placeholder header text', () => {
    renderWithIntl(<Layout children={<h1>'child'</h1>} />)

    const header = screen.getByText(/Template Header/i)

    expect(header).toBeInTheDocument()
    expect(header).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = renderWithIntl(<Layout children={<h1>'child'</h1>} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
