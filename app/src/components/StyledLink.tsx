import React from "react";
import Link from 'next/link'

export interface StyledLinkProps {
  href: string
  text: string
  external?: boolean
}

export const StyledLink: React.FC<StyledLinkProps> = ({href, text, external = false}) => {
  let className = 'usa-link'
  if (external) {
    className += ' usa-link--external'
  }

  return (
    <Link href={href} passHref>
      <a className={className}>{text}</a>
    </Link>
  )
}

export default StyledLink
