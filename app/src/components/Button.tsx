import Image from 'next/image'
import Link from 'next/link'
import styled, { StyledComponent } from 'styled-components'

type Props = {
  text: string
  href: string /* TODO: create global type for routes */
  vector?: boolean
  width?: string /* TODO: check if there is a type for css widths */
}

const Button = (props: Props) => {
  const { width, text, vector, href } = props

  return (
    <Link href={href}>
      <Btn className="usa-button usa-button--small" width={width}>
        {text}
        {vector && (
          <Image
            src="/img/vector.svg"
            alt="continue vector"
            width={20}
            height={15}
          />
        )}
      </Btn>
    </Link>
  )
}

const Btn: StyledComponent<'a', object, { width?: string }, never> = styled.a<{
  width?: string
}>`
  background-color: black;
  display: flex;
  font-family: 'Balsamiq Sans', cursive;
  font-weight: 400;
  gap: 10px;
  width: ${(props) => (props.width ? props.width : '90%')};
`

export default Button
