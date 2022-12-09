import { render } from '@testing-library/react'

import StyledLink from '@components/StyledLink'

const testProps = {
  href: '/somewhere',
  textKey: 'link text',
  external: false,
}

it('should match snapshot for internal link', () => {
  const { container } = render(<StyledLink {...testProps} />)
  expect(container).toMatchSnapshot()
})

it('should match snapshot for external link', () => {
  const { container } = render(<StyledLink {...testProps} external={true} />)
  expect(container).toMatchSnapshot()
})
