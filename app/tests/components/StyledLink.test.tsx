import StyledLink from '@components/StyledLink'

import { testSnapshot } from '../helpers/sharedTests'

const testProps = {
  href: '/somewhere',
  textKey: 'link text',
  external: false,
}

it('should match snapshot for internal link', () => {
  const element = <StyledLink {...testProps} />
  testSnapshot(element)
})

it('should match snapshot for external link', () => {
  const element = <StyledLink {...testProps} external={true} />
  testSnapshot(element)
})
