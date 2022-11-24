import { render, screen } from '@testing-library/react'
import { ChangeEvent } from 'react'

import InputChoiceGroup, {
  InputChoiceGroupProps,
} from '@components/InputChoiceGroup'

const choices = [
  {
    checked: false,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {},
    labelKey: 'label a',
    name: 'name-a',
    value: 'a',
  },
  {
    checked: false,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {},
    labelKey: 'label b',
    name: 'name-b',
    value: 'b',
  },
  {
    checked: false,
    handleChange: (e: ChangeEvent<HTMLInputElement>) => {},
    labelKey: 'label c',
    name: 'name-c',
    value: 'c',
  },
]

const testProps: InputChoiceGroupProps = {
  choices: choices,
  titleKey: 'title',
  required: false,
  type: 'checkbox',
}

it('should match snapshot when it is a set of checkboxes', () => {
  const { container } = render(<InputChoiceGroup {...testProps} />)
  expect(container).toMatchSnapshot()
})

it('should match snapshot when it is a set of radio buttons', () => {
  const { container } = render(<InputChoiceGroup {...testProps} type="radio" />)
  expect(container).toMatchSnapshot()
})

it('should match display required marker if required is true', () => {
  render(<InputChoiceGroup {...testProps} required={true} />)
  const required = screen.getByText('*')
  expect(required).toBeInTheDocument()
})

it('should display an accordion if passed as props', () => {
  const accordion = {
    headerKey: 'accordion header',
    bodyKey: 'accordion body',
  }
  render(<InputChoiceGroup {...testProps} accordion={accordion} />)
  const accordionElement = screen.getByText('accordion header')
  expect(accordionElement).toBeInTheDocument()
})
