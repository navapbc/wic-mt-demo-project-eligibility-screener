import Link from 'next/link'
import { ReactElement } from 'react'

import Button from '@components/Button'

type Props = {
  disabled?: boolean
  labelKey: string
  href: string /* TODO: create global type for routes */
  style?: string
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, labelKey, style } = props

  return (
    <Link href={href} passHref>
      <Button disabled={disabled} labelKey={labelKey} style={style} />
    </Link>
  )
}

export default ButtonLink
