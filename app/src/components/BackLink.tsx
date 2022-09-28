import { ReactElement } from 'react'

import ButtonLink from '@components/ButtonLink'

export interface BackLinkProps {
  href: string
}

export const BackLink = (props: BackLinkProps): ReactElement => {
  const { href } = props
  return <ButtonLink labelKey="backlinkText" href={href} style="unstyled" />
}

export default BackLink
