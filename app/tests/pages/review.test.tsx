import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Review from '@pages/review'

describe('Review', () => {
  it('should render the heading', () => {
    render(<Review />)

    const heading = screen.getByText(/Review and submit your information/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Review />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
