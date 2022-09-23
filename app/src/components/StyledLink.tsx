import { Trans } from 'next-i18next'
import Link from 'next/link'
import { ReactElement } from 'react'

export interface StyledLinkProps {
  href: string
  textKey: string
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
        <Trans i18nKey={textKey} />
      </a>
    )
  } else {
    // Only use the next/link component for internal routing.
    return (
      <Link href={href} passHref>
        <a className="usa-link">
          <Trans i18nKey={textKey} />
        </a>
      </Link>
    )
  }
}

export default StyledLink
