import { render, screen } from '@testing-library/react'

import ReviewCollection from '@components/ReviewCollection'

import { testSnapshot } from '../helpers/sharedTests'

const reviewElements = [
  { labelKey: 'element a', children: 'child a' },
  { labelKey: 'element b', children: 'child b' },
]

const testProps = {
  headerKey: 'header key',
  reviewElements: reviewElements,
  editable: false,
  editHref: '/edit-link',
  firstElement: false,
}

it('should match snapshot when it is the first element', () => {
  testSnapshot(<ReviewCollection {...testProps} firstElement={true} />)
})

it('should match snapshot when it is not the first element', () => {
  testSnapshot(<ReviewCollection {...testProps} firstElement={false} />)
})
