// test/pages/index.test.js
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Layout from '@components/Layout'

describe('Layout', () => {
  it('should render placeholder header text', () => {
    render(<Layout children={<h1>'child'</h1>} />)

    const header = screen.getByText(/WIC Eligibility Screener/i)

    expect(header).toBeInTheDocument()
    expect(header).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Layout children={<h1>'child'</h1>} />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
