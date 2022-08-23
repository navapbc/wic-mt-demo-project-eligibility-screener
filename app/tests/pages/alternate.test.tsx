import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Alternate from '@pages/alternate'

describe('Alternate', () => {
  it('should render the heading', () => {
    render(<Alternate />)

    const heading = screen.getByText(/Your eligibility/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Alternate />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
