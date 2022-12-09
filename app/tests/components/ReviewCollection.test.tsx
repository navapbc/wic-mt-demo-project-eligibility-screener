import { render, screen } from '@testing-library/react'

import ReviewCollection from '@components/ReviewCollection'

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
  const { container } = render(
    <ReviewCollection {...testProps} firstElement={true} />
  )
  expect(container).toMatchSnapshot()
})

it('should match snapshot when it is not the first element', () => {
  const { container } = render(
    <ReviewCollection {...testProps} firstElement={false} />
  )
  expect(container).toMatchSnapshot()
})
