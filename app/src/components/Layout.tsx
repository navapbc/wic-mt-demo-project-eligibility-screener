import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { ReactElement } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactElement
}

const Layout = ({ children }: Props): ReactElement => {
  const { t } = useTranslation('common')

  return (
    <div className="container">
      <header className="header usa-header">
        <em className="usa-logo__text">{t('Layout.header')}</em>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <div>{t('Layout.footer')}</div>
        <Logos>
          <Image
            src="/img/wic-logo.svg"
            alt="WIC logo"
            width={125}
            height={62}
          />
          <Image
            src="/img/montana-logo.svg"
            alt="Monthana DPHHS logo"
            width={91}
            height={63}
          />
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
