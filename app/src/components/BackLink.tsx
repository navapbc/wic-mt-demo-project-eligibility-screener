import { ReactElement } from 'react'

import StyledLink from '@components/StyledLink'

export interface BackLinkProps {
  href: string
}

export const BackLink = (props: BackLinkProps): ReactElement => {
  const { href } = props
  return <StyledLink href={href} textKey="backlinkText" />
}

export default BackLink
