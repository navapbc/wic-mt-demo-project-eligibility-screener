import { render, screen } from '@testing-library/react'
import { ChangeEvent } from 'react'

import TextField from '@components/TextField'

const testProps = {
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {},
  id: 'input-id',
  labelKey: 'input label',
  required: false,
  value: '',
}

it('should match snapshot when it is a textfield', () => {
  const { container } = render(<TextField {...testProps} type="input" />)
  expect(container).toMatchSnapshot()
})

it('should match snapshot when it is a textarea', () => {
  const { container } = render(<TextField {...testProps} type="textarea" />)
  expect(container).toMatchSnapshot()
})

it('should be a textfield by default', () => {
  render(<TextField {...testProps} />)
  const element = screen.getByRole('textbox')
  expect(element).toBeInTheDocument()
})

it('should match display required marker if required is true', () => {
  render(<TextField {...testProps} required={true} />)
  const required = screen.getByText('*')
  expect(required).toBeInTheDocument()
})

it('should display the value when it is a textfield', () => {
  render(<TextField {...testProps} type="input" value="textfield value" />)
  const textbox = screen.getByRole('textbox')
  expect(textbox).toHaveValue('textfield value')
})
it('should display the value when it is a textarea', () => {
  render(<TextField {...testProps} type="textarea" value="textarea value" />)
  const textbox = screen.getByRole('textbox')
  expect(textbox).toHaveValue('textarea value')
})
