import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'

type Props = {
  text: string,
  href: string,
  vector?: boolean,
  width?: string
}

const Button = (props: Props) => {
  const { width, text, vector, href } = props

  return (
    <Link href={href}>
      <Btn className="usa-button usa-button--small" width={width}>
        {text}
        { vector && <Image src="/img/vector.svg" alt="continue vector" width={20} height={15} /> }
      </Btn>
    </Link>
  )
}

const Btn = styled.a`
  background-color: black;
  font-family: 'Balsamiq Sans', cursive;
  font-weight: 400;
  display: flex;
  gap: 10px;
  width: ${props => props.width ? props.width : "90%"}
`

export default Button
