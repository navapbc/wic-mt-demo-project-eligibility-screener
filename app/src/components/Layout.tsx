import { Trans } from 'next-i18next'
import Image from 'next/image'
import { ReactElement } from 'react'

type Props = {
  children: ReactElement
}

const Layout = ({ children }: Props): ReactElement => {
  return (
    <div className="container">
      <header className="header usa-header usa-header--basic" role="banner">
        <div className="usa-navbar">
          <div className="grid-row">
            <div className="desktop:grid-col-8">
              <div className="usa-logo margin-left-2">
                <em className="usa-logo__text">
                  <Trans i18nKey="Layout.header" />
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
              </div>
              <div className="font-body-3xs">
                <p>
                  <Trans
                    components={[
                      <a
                        key="0"
                        href="https://dphhs.mt.gov/ecfsd/wic/index"
                        className="usa-link usa-link--external"
                        target="_blank"
                        rel="noopener noreferrer"
                      />,
                      <a
                        key="1"
                        href="https://www.signupwic.com/"
                        className="usa-link usa-link--external"
                        target="_blank"
                        rel="noopener noreferrer"
                      />,
                    ]}
                    i18nKey={'Layout.footer1'}
                  />
                </p>
                <p>
                  <Trans
                    components={[
                      <a
                        key="0"
                        href="https://www.fns.usda.gov/civil-rights/usda-nondiscrimination-statement-other-fns-programs"
                        className="usa-link usa-link--external"
                        target="_blank"
                        rel="noopener noreferrer"
                      />,
                    ]}
                    i18nKey={'Layout.footer2'}
                  />
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
