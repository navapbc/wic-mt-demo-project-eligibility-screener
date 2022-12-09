import StyledLink from '@components/StyledLink'

export type BackLinkProps = {
  href: string
}

export const BackLink = (props: BackLinkProps) => {
  const { href } = props
  return <StyledLink textKey="backlinkText" href={href} external={false} />
}

export default BackLink
