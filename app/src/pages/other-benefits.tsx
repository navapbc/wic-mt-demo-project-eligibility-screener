import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'

const OtherBenefits: NextPage = () => {
  return (
    <>
      <BackLink href="/eligibility" />
      <h1>
        <Trans i18nKey="OtherBenefits.title" />
      </h1>
      <h2>
        <Trans i18nKey="OtherBenefits.subHeader" />
      </h2>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://dphhs.mt.gov/Assistance"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={'OtherBenefits.assistance'}
        />
      </p>
      <p>
        <Trans
          components={[
            <a
              key="0"
              href="https://www.signupwic.com/"
              className="usa-link usa-link--external"
              target="_blank"
              rel="noopener noreferrer"
            />,
          ]}
          i18nKey={'OtherBenefits.location'}
        />
      </p>
      <ButtonLink href="/" labelKey="OtherBenefits.button" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default OtherBenefits
