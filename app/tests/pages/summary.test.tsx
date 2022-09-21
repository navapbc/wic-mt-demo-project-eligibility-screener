import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Summary from '@pages/summary'

describe('Summary', () => {
  it('should render the heading', () => {
    render(<Summary />)

    const heading = screen.getByText(/Your confirmation/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Summary />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
