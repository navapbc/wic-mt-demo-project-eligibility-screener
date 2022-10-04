import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import HowItWorks from '@pages/how-it-works'

describe('HowItWorks', () => {
  it('should render title text', () => {
    render(<HowItWorks />)

    const title = screen.getByText(
      /You can start applying for WIC by checking to see if you're eligible/i
    )

    expect(title).toBeInTheDocument()
    expect(title).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<HowItWorks />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
