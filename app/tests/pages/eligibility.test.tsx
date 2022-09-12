import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Eligibility from '@pages/eligibility'

describe('Eligibility', () => {
  it('should render first question text', () => {
    render(<Eligibility previousRoute="/review" />)

    const question = screen.getByText(/1. Do you live or work in Montana?/i)

    expect(question).toBeInTheDocument()
    expect(question).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = render(<Eligibility previousRoute="/review" />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  describe('residential radios', () => {
    it('should select yes option', () => {
      render(<Eligibility previousRoute="/review" />)

      const yesRadio = screen.getByLabelText(/Yes/i)

      expect(yesRadio).not.toBeChecked()
      fireEvent.click(yesRadio)
      expect(yesRadio).toBeChecked()
    })
  })

  describe('continue link', () => {
    it.skip('should link to income page by default', () => {
      render(<Eligibility previousRoute="/" />)

      const continueBtn = screen.getByText(/Continue/i)

      expect(continueBtn.getAttribute('href')).toBe('/income')
    })

    it.skip('should link to alternate page if none is selected for question 2', () => {
      render(<Eligibility previousRoute="/" />)

      const noneBtn = screen.getAllByLabelText(/None of the above/i)[0]

      expect(noneBtn).not.toBeChecked()
      fireEvent.click(noneBtn)
      expect(noneBtn).toBeChecked()

      const continueBtn = screen.getByText(/Continue/i)

      expect(continueBtn.getAttribute('href')).toBe('/alternate')
    })
  })
})
