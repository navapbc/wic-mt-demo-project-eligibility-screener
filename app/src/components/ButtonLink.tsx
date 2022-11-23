import Link from 'next/link'
import { MouseEvent, ReactElement } from 'react'
import { UrlObject } from 'url'

import Button from '@components/Button'

import { I18nKey } from '@src/types'

export type ButtonLinkProps = {
  disabled?: boolean
  labelKey: I18nKey
  href: UrlObject | string
  style?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

const ButtonLink = (props: ButtonLinkProps): ReactElement => {
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
