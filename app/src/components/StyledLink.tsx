import Link from 'next/link'
import { ReactElement } from 'react'

import TransLine from '@components/TransLine'

import { I18nKey } from '@src/types'

export type StyledLinkProps = {
  href: string
  textKey: I18nKey
  external?: boolean
}

export const StyledLink = (props: StyledLinkProps): ReactElement => {
  const { href, textKey, external = false } = props
  if (external) {
    return (
      <a
        className="usa-link usa-link--external"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <TransLine i18nKey={textKey} />
      </a>
    )
  } else {
    // Only use the next/link component for internal routing.
    return (
      <Link href={href} passHref>
        <a className="usa-link">
          <TransLine i18nKey={textKey} />
        </a>
      </Link>
    )
  }
}

export default StyledLink
