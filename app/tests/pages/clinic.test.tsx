// test/pages/index.test.js
import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'

import Clinic from '@pages/clinic'

describe('Clinic', () => {
  it('should render the heading', () => {
    render(<Clinic previousRoute="/review" />)

    const heading = screen.getByText(/Choose a clinic/i)

    expect(heading).toBeInTheDocument()
    expect(heading).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Clinic previousRoute="/review" />)
    const results = await axe(container)

    await waitFor(() => {
      expect(results).toHaveNoViolations()
    })
  })
})
