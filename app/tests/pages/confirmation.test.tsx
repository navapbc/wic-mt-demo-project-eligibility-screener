import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Confirmation from '@pages/confirmation'

describe('Confirmation', () => {
  it('should render the heading', () => {
    render(<Confirmation />)

    const heading = screen.getByText(/Your confirmation/)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Confirmation />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
