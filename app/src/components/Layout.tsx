import { Trans, useTranslation } from 'next-i18next'
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
      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo">
              <em className="usa-logo__text">{t('Layout.header')}</em>
            </div>
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <Logos>
          <Image
            src="/img/wic-logo.svg"
            alt="WIC logo"
            width={64.52}
            height={32}
          />
          <Image
            src="/img/montana-logo.svg"
            alt="Monthana DPHHS logo"
            width={46.22}
            height={32}
          />
        </Logos>
        <br />
        <div>
          <Trans
            components={[
              <a key="0" href="https://dphhs.mt.gov/ecfsd/wic/index" />,
              <a key="1" href="https://www.signupwic.com/" />,
            ]}
            i18nKey={'Layout.footer1'}
            t={t}
          />
          <br />
          <br />
          <Trans
            components={[
              <a
                key="0"
                href="https://www.fns.usda.gov/civil-rights/usda-nondiscrimination-statement-other-fns-programs"
              />,
            ]}
            i18nKey={'Layout.footer2'}
            t={t}
          />
        </div>
      </footer>
    </div>
  )
}

const Logos = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 80px);
`
export default Layout
