import { render, screen } from '@testing-library/react'

import Dropdown, { DropdownProps } from '@components/Dropdown'

import { testSnapshot } from '../helpers/sharedTests'

const testProps: DropdownProps = {
  handleChange: (e) => {},
  id: 'test-id',
  labelKey: 'dropdown label',
  options: ['a', 'b', 'c'],
}

it('should match snapshot', () => {
  testSnapshot(<Dropdown {...testProps} />)
})

it('should match display required marker if required is true', () => {
  render(<Dropdown {...testProps} required={true} />)
  const required = screen.getByText('*')
  expect(required).toBeInTheDocument()
})

it('should show the selected element if passed in', () => {
  render(<Dropdown {...testProps} selectedOption="c" />)
  const required = screen.getByRole('option', {
    name: 'c',
  }) as HTMLOptionElement
  expect(required.selected).toBe(true)
})
