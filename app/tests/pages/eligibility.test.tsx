import { screen, fireEvent, render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Eligibility from '@pages/eligibility'
import { act } from 'react-dom/test-utils'

describe('Eligibility', () => {
  it('should render first question text', () => {
    render(<Eligibility />)

    const question = screen.getByText(/1. Do you live or work in Montana?/i)

    expect(question).toBeInTheDocument()
    expect(question).toMatchSnapshot()
  })

  it('should pass accessibility scan', async() => {
    const { container } = render(<Eligibility />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  describe('residential radios', () => {
    it.skip('should select yes option', () => {
      render(<Eligibility />)

      const yesRadio = screen.getByLabelText(/Yes/i)

      expect(yesRadio).not.toBeChecked()
      fireEvent.click(yesRadio)
      expect(yesRadio).toBeChecked()
    })
  })
})
