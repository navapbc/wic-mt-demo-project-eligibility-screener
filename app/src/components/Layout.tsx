import Image from 'next/image'
import { ReactElement } from 'react'

import Alert from '@components/Alert'
import TransLine from '@components/TransLine'

type Props = {
  children: ReactElement
}

const Layout = ({ children }: Props) => {
  return (
    <div className="container">
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <Alert
          alertBody="demoAlertBanner.text"
          type="warning"
          icon={true}
          slim={true}
        />
      )}
      <header className="header usa-header usa-header--basic" role="banner">
        <div className="usa-navbar">
          <div className="grid-row">
            <div className="desktop:grid-col-8">
              <div className="usa-logo margin-left-2">
                <em className="usa-logo__text">
                  <TransLine i18nKey="Layout.header" />
                </em>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="grid-row">
          <div className="desktop:grid-col-8 padding-2 padding-bottom-8">
            {children}
          </div>
        </div>
      </main>
      <footer className="footer usa-footer usa-footer--slim">
        <div className="usa-footer__primary-section">
          <div className="grid-row">
            <div className="desktop:grid-col-8 padding-2">
              <div className="logos">
                <Image
                  src={`${process.env.BASE_PATH ?? ''}/img/wic-logo.svg`}
                  alt="WIC logo"
                  width={64.52}
                  height={32}
                />
                <Image
                  src={`${process.env.BASE_PATH ?? ''}/img/montana-logo.svg`}
                  alt="Monthana DPHHS logo"
                  width={46.22}
                  height={32}
                />
              </div>
              <div className="font-body-3xs">
                <p>
                  <TransLine i18nKey="Layout.footer1.text" />
                </p>
                <p>
                  <TransLine i18nKey="Layout.footer2.text" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
