import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import OtherBenefits from '@pages/other-benefits'

describe('OtherBenefits', () => {
  it('should render the heading', () => {
    render(<OtherBenefits />)

    const heading = screen.getByText(/Your eligibility/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<OtherBenefits />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
