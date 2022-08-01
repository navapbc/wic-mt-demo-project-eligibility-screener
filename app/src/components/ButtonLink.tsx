import Image from 'next/image'
import Link from 'next/link'
import { ReactElement } from 'react'
import styled, { StyledComponent } from 'styled-components'

type Props = {
  disabled?: boolean
  label: string
  href: string /* TODO: create global type for routes */
  vector?: boolean
  width?: string /* TODO: check if there is a type for css widths */
}

const ButtonLink = (props: Props): ReactElement => {
  const { disabled, href, label, vector, width } = props

  return (
    <Link href={href}>
      <Button
        className={`usa-button usa-button--small disabled`}
        disabled={disabled}
        width={width}
      >
        {label}
        {vector && (
          <Image
            src="/img/vector.svg"
            alt="continue vector"
            width={20}
            height={15}
          />
        )}
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
  background-color: ${(props) => (props.disabled ? 'grey' : 'black')};
  display: flex;
  font-family: 'Balsamiq Sans', cursive;
  font-weight: 400;
  gap: 10px;
  pointer-events: ${(props) => props.disabled && 'none'};
  width: ${(props) => (props.width ? props.width : '90%')};
`

export default ButtonLink
