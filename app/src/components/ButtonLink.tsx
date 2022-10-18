import Link from 'next/link'
import { ReactElement } from 'react'
import { UrlObject } from 'url'

import Button from '@components/Button'

type Props = {
  disabled?: boolean
  labelKey: string
  href: UrlObject | string
  style?: string
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, labelKey, style } = props

  return (
    <Link href={href}>
      <Button disabled={disabled} labelKey={labelKey} style={style} />
    </Link>
  )
}

export default ButtonLink
