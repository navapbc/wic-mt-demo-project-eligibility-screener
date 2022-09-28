import Link from 'next/link'
import { ReactElement } from 'react'

type Props = {
  disabled?: boolean
  href: string /* TODO: create global type for routes */
  label: string
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, label } = props

  return (
    <Link href={href} passHref>
      <button className="usa-button usa-button--small" disabled={disabled}>
        {label}
      </button>
    </Link>
  )
}

export default ButtonLink
