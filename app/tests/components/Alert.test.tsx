import { render, screen } from '@testing-library/react'

import Alert, { AlertProps, AlertTypes } from '@components/Alert'

import { testSnapshot } from '../helpers/sharedTests'

const testProps: AlertProps = {
  alertBody: 'body',
  type: 'info',
}

const alertTypes: Array<AlertTypes[]> = [
  ['error'],
  ['info'],
  ['success'],
  ['warning'],
]

it.each(alertTypes)('should match snapshot for %s alerts', (type) => {
  testProps.type = type
  const element = <Alert {...testProps} />
  testSnapshot(element)
})

it.each(alertTypes)(
  'should have the correct css class for %s alerts',
  (type) => {
    testProps.type = type
    const element = <Alert {...testProps} />
    render(element)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass(`usa-alert--${type}`)
  }
)

it('should display with no icon if the icon prop is undefined', () => {
  const element = <Alert {...testProps} />
  render(element)

  const alert = screen.getByRole('alert')
  expect(alert).toHaveClass(`usa-alert--no-icon`)
})

it('should display with no icon if the icon prop is false', () => {
  testProps.icon = false
  const element = <Alert {...testProps} />
  render(element)

  const alert = screen.getByRole('alert')
  expect(alert).toHaveClass(`usa-alert--no-icon`)
})

it('should display an icon if the icon prop is true', () => {
  testProps.icon = true
  const element = <Alert {...testProps} />
  render(element)

  const alert = screen.getByRole('alert')
  expect(alert).not.toHaveClass(`usa-alert--no-icon`)
})
