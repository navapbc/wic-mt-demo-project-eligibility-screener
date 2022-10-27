import { render, screen } from '@testing-library/react'

import ReviewElement from '@components/ReviewElement'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  const element = (
    <ReviewElement labelKey="label">This is a child</ReviewElement>
  )
  testSnapshot(element)
})

it('should render children', () => {
  render(<ReviewElement labelKey="label">This is a child</ReviewElement>)
  const child = screen.getByText('This is a child')
  expect(child).toBeInTheDocument()
})
