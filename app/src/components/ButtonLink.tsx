import { Trans } from 'next-i18next'
import Link from 'next/link'
import { ReactElement } from 'react'

type Props = {
  disabled?: boolean
  labelKey: string
  href: string /* TODO: create global type for routes */
  style?: string
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, labelKey, style } = props

  let buttonStyle = ''
  if (style) {
    buttonStyle = `usa-button--${style} margin-top-1`
  } else {
    buttonStyle = 'margin-top-6'
  }

  return (
    <Link href={href} passHref>
      <button
        className={`usa-button usa-button--small display-block ${buttonStyle}`}
        disabled={disabled}
      >
        <Trans i18nKey={labelKey} />
      </button>
    </Link>
  )
}

export default ButtonLink
