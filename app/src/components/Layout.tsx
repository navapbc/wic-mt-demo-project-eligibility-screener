import { ReactElement } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import styled from 'styled-components'

type Props = {
  children: ReactElement
}

const Layout = ({ children }: Props) => {
  const t = useTranslations('Layout')

  return (
    <div className="container">
      <header className="header usa-header">
        <em className='usa-logo__text'>WIC Eligibility Screener</em>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div>Lorem ipsum odor amet, consectetuer adipiscing elit. Metus himenaeos proin. Non sapien. Habitant lorem nascetur pretium.</div>
        <Logos>
          <Image src="/img/wic-logo.svg" alt="WIC logo" width={125} height={62} />
          <Image src="/img/montana-logo.svg" alt="Monthana DPHHS logo" width={91} height={63} />
        </Logos>
      </footer>
    </div>
  )
}

const Logos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding-top: 1rem;
`

export default Layout
