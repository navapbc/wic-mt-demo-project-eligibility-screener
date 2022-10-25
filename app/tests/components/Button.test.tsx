import { render, screen } from '@testing-library/react'

import Button, { buttonStyleOptions } from '@components/Button'

import { testSnapshot } from '../helpers/sharedTests'

const styleOptions = buttonStyleOptions.map((style) => [style])

it.each(styleOptions)('should match snapshot for %s style', (style) => {
  testSnapshot(
    <Button disabled={false} labelKey="button label" style={style} />
  )
})

it.each(styleOptions)(
  'should have the correct css class for %s style',
  (style) => {
    render(<Button labelKey="button label" style={style} />)
    const button = screen.getByRole('button')

    if (style !== 'default') {
      expect(button).toHaveClass(`usa-button--${style}`)
    }
  }
)

it('should be disabled if disabled is true', () => {
  render(<Button disabled={true} labelKey="button label" />)
  const button = screen.getByRole('button')
  expect(button).toBeDisabled()
})

it('should be disabled if disabled is false', () => {
  render(<Button disabled={false} labelKey="button label" />)
  const button = screen.getByRole('button')
  expect(button).not.toBeDisabled()
})
