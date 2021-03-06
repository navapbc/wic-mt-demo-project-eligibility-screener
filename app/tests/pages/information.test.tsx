import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Information from '@pages/information'

describe('Information', () => {
  it('should render title text', () => {
    render(<Information />)

    const title = screen.getByText(
      /You can start applying for WIC by checking to see if you're eligible/i
    )

    expect(title).toBeInTheDocument()
    expect(title).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Information />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
