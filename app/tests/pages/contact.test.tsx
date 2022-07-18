import { fireEvent, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'

import Contact from '@pages/contact'

describe('Contact', () => {
  it('should render first name prompt', () => {
    render(<Contact />)

    const prompt = screen.getByText(/What's your first name?/i)

    expect(prompt).toBeInTheDocument()
    expect(prompt).toMatchSnapshot()
  })

  it('should update name input value', () => {
    render(<Contact />)

    const nameInput = screen.getByLabelText(/What's your first name?/i) as HTMLInputElement

    expect(nameInput.value).toBe('')
    fireEvent.change(nameInput, { target: { value: 'Jane' } })
    expect(nameInput.value).toBe('Jane')
  })

  describe('phone number input', () => {
    it('should not allow non-numbers', () => {
      render(<Contact />)
  
      const phoneNumber = screen.getByLabelText(/What's the best phone number to reach you at?/i) as HTMLInputElement
  
      expect(phoneNumber.value).toBe('')
      fireEvent.change(phoneNumber, { target: { value: 'not a number' } })
      expect(phoneNumber.value).toBe('')
    })

    it('should format number', () => {
      render(<Contact />)
  
      const phoneNumber = screen.getByLabelText(/What's the best phone number to reach you at?/i) as HTMLInputElement
  
      expect(phoneNumber.value).toBe('')
      fireEvent.change(phoneNumber, { target: { value: '1111111111' } })
      expect(phoneNumber.value).toBe('111-111-1111')
    })
  })
})
