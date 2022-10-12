import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Income from '@pages/income'

describe('Income', () => {
  it('should render the heading', () => {
    render(<Income />)

    const heading = screen.getByText(/To be eligible for WIC, your/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Income />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
