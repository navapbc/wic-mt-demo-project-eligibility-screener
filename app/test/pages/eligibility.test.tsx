import { screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { axe } from 'jest-axe'

import Eligibility from '@pages/eligibility'
import renderWithIntl from '../renderWithIntl'

describe('Eligibility', () => {
  it('should render first question text', () => {
    renderWithIntl(<Eligibility />)

    const question = screen.getByText(/1. Do you live or work in Montana?/i)

    expect(question).toBeInTheDocument()
    expect(question).toMatchSnapshot()
  })

  it('should pass accessibility scan', async () => {
    const { container } = renderWithIntl(<Eligibility />)
    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })

  describe('residential radios', () => {
    it('should select yes option', async () => {
      renderWithIntl(<Eligibility />)

      const yesRadio = screen.getByText(/Yes/i)

      await userEvent.click(yesRadio)

      expect(yesRadio).toBeChecked()
    })
  })
})
