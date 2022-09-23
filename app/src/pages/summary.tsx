import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'
import StyledLink from '@components/StyledLink'

const Summary: NextPage = () => {
  return (
    <>
      <h1>
        <Trans i18nKey="Summary.title" />
      </h1>
      <p>
        <Trans i18nKey="Summary.body" />
      </p>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.interestedIn" />
        </h4>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            textKey="Summary.learnAbout"
            external={true}
          />
        </p>
      </div>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.submitAnother" />
        </h4>
        <ButtonLink labelKey="Summary.startNew" href="/" style="outline" />
      </div>
      <div className="content-group-small">
        <h4>
          <Trans i18nKey="Summary.keepCopy" />
        </h4>
      </div>
      <OverviewTables />
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

export default Summary
