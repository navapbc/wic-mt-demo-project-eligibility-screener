// test/pages/index.test.js
import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Index from '@pages/index'

describe('Index', () => {
  it('should render the heading', () => {
    render(<Index />)

    const heading = screen.getByText(/Start an application for WIC/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Index />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
