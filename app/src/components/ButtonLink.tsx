import Image from 'next/image'
import Link from 'next/link'
import styled, { StyledComponent } from 'styled-components'

type Props = {
  label: string
  href: string /* TODO: create global type for routes */
  vector?: boolean
  width?: string /* TODO: check if there is a type for css widths */
}

const ButtonLink = (props: Props): JSX.Element => {
  const { width, label, vector, href } = props

  return (
    <Link href={href}>
      <Button className="usa-button usa-button--small" width={width}>
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

const Button: StyledComponent<'a', object, { width?: string }, never> = styled.a<{
  width?: string
}>`
  background-color: black;
  display: flex;
  font-family: 'Balsamiq Sans', cursive;
  font-weight: 400;
  gap: 10px;
  width: ${(props) => (props.width ? props.width : '90%')};
`

export default ButtonLink
