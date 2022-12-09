import { render, screen } from '@testing-library/react'

import ReviewElement from '@components/ReviewElement'

it('should match snapshot', () => {
  const { container } = render(
    <ReviewElement labelKey="label">This is a child</ReviewElement>
  )
  expect(container).toMatchSnapshot()
})

it('should render children', () => {
  render(<ReviewElement labelKey="label">This is a child</ReviewElement>)
  const child = screen.getByText('This is a child')
  expect(child).toBeInTheDocument()
})
