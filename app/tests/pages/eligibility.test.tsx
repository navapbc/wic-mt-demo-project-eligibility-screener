import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Eligibility from '@pages/eligibility'

describe('Eligibility', () => {
  it('should render first question text', () => {
    render(<Eligibility previousRoute="/review" />)

    const question = screen.getByText(/Do you live or work in Montana?/i)

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

      const yesRadio = screen.getAllByLabelText(/Yes/)[0]

      expect(yesRadio).not.toBeChecked()
      fireEvent.click(yesRadio)
      expect(yesRadio).toBeChecked()
    })
  })

  describe('none of the above', () => {
    it('should deselect all other categories', () => {
      const pregnantBtn = screen.getByLabelText(/I'm pregnant/)
      fireEvent.click(pregnantBtn)
      expect(pregnantBtn).toBeChecked()

      const noneBtn = screen.getAllByLabelText(/None of the above/)[0]
      expect(noneBtn).not.toBeChecked()
      fireEvent.click(noneBtn)
      expect(noneBtn).toBeChecked()
      expect(pregnantBtn).not.toBeChecked()
    })

    it('should deselect none of the above when another category is selected', () => {
      const noneBtn = screen.getAllByLabelText(/None of the above/)[0]
      expect(noneBtn).not.toBeChecked()
      fireEvent.click(noneBtn)
      expect(noneBtn).toBeChecked()

      const pregnantBtn = screen.getByLabelText(/I'm pregnant/)
      fireEvent.click(pregnantBtn)
      expect(pregnantBtn).toBeChecked()
      expect(noneBtn).not.toBeChecked()
    })

    it('should deselect all other program', () => {
      const fdpirBtn = screen.getByLabelText(/FDPIR (Food Distribution Program on Indian Reservations)/)
      fireEvent.click(fdpirBtn)
      expect(fdpirBtn).toBeChecked()

      const noneBtn = screen.getAllByLabelText(/None of the above/)[1]
      expect(noneBtn).not.toBeChecked()
      fireEvent.click(noneBtn)
      expect(noneBtn).toBeChecked()
      expect(fdpirBtn).not.toBeChecked()
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
