import { render, screen } from '@testing-library/react'

import Accordion from '@components/Accordion'

import { setupUserEvent } from '../helpers/setup'
import { testSnapshot } from '../helpers/sharedTests'

const testProps = {
  bodyKey: 'body',
  headerKey: 'header',
}

it('should match snapshot', () => {
  testSnapshot(<Accordion {...testProps} />)
})

it('should expand the accordion on click', async () => {
  const user = setupUserEvent()
  render(<Accordion {...testProps} />)

  const body = screen.getByText(testProps.bodyKey)
  expect(body).not.toBeVisible()

  const button = screen.getByText(testProps.headerKey)
  await user.click(button)
  expect(body).toBeVisible()
})
