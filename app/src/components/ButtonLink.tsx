import Link from 'next/link'
import { MouseEvent, ReactElement } from 'react'
import { UrlObject } from 'url'

import Button from '@components/Button'

type Props = {
  disabled?: boolean
  labelKey: string
  href: UrlObject | string
  style?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
}

const ButtonLink = (props: Props): ReactElement => {
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
