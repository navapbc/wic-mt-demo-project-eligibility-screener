import Link from 'next/link'
import React from 'react'

export interface StyledLinkProps {
  href: string
  text: string
  external?: boolean
}

export const StyledLink: React.FC<StyledLinkProps> = ({
  href,
  text,
  external = false,
}) => {
  if (external) {
    return (
      <a
        className="usa-link usa-link--external"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    )
  } else {
    // Only use the next/link component for internal routing.
    return (
      <Link href={href} passHref>
        <a className="usa-link">{text}</a>
      </Link>
    )
  }
}

export default StyledLink
