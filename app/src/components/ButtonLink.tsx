import Link from 'next/link'
import { ReactElement } from 'react'
import styled, { StyledComponent } from 'styled-components'

type Props = {
  disabled?: boolean
  label: string
  href: string /* TODO: create global type for routes */
  width?: string /* TODO: check if there is a type for css widths */
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, label, width } = props

  return (
    <Link href={href} type="submit">
      <Button
        className="usa-button usa-button--small disabled"
        disabled={disabled}
        type="submit"
        width={width}
      >
        {label}
      </Button>
    </Link>
  )
}

const Button: StyledComponent<
  'a',
  object,
  {
    disabled?: boolean
    width?: string
  },
  never
> = styled.a<{
  disabled?: boolean
  width?: string
}>`
  background-color: ${(props) => props.disabled && 'grey'};
  display: flex;
  font-weight: 400;
  gap: 10px;
  pointer-events: ${(props) => props.disabled && 'none'};
  width: ${(props) => (props.width ? props.width : '90%')};
`

export default ButtonLink
