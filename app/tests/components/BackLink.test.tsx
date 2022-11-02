import { render, screen } from '@testing-library/react'

import BackLink from '@components/BackLink'

import { testSnapshot } from '../helpers/sharedTests'

it('should match snapshot', () => {
  testSnapshot(<BackLink href="/" />)
})
