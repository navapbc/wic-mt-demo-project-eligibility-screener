import { render, screen } from '@testing-library/react'

import ButtonLink from '@components/ButtonLink'

import { setupUserEvent } from '../helpers/setup'
import { testActionButtonRoute } from '../helpers/sharedTests'

it('should do something', async () => {
  const user = setupUserEvent()
  const element = <ButtonLink labelKey="button label" href="/test" />
  await testActionButtonRoute(element, '/test', 'button label', user)
})
