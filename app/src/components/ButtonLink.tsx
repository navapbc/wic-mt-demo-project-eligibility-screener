import Link from 'next/link'
import { ReactElement } from 'react'

type Props = {
  disabled?: boolean
  label: string
  href: string /* TODO: create global type for routes */
  style?: string
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, label, style } = props

  let buttonStyle = ''
  if (style) {
    buttonStyle = `usa-button--${style} margin-top-1`
  } else {
    buttonStyle = 'margin-top-3'
  }

  return (
    <Link href={href} passHref>
      <button
        className={`usa-button usa-button--small display-block ${buttonStyle}`}
        disabled={disabled}
      >
        {label}
      </button>
    </Link>
  )
}

export default ButtonLink
