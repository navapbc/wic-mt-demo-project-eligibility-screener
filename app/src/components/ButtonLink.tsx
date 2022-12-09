import Link from 'next/link'
import { MouseEvent } from 'react'
import { UrlObject } from 'url'

import Button, { buttonStyleOptions } from '@components/Button'

import { i18nKey } from '@src/types'

export type ButtonLinkProps = {
  disabled?: boolean
  labelKey: i18nKey
  href: UrlObject | string
  style?: typeof buttonStyleOptions[number]
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

const ButtonLink = (props: ButtonLinkProps) => {
  const { disabled, href, labelKey, style, onClick } = props

  return (
    <Link href={href}>
      <Button
        disabled={disabled}
        labelKey={labelKey}
        style={style}
        onClick={onClick}
      />
    </Link>
  )
}

export default ButtonLink
