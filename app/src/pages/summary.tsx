import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'
import StyledLink from '@components/StyledLink'

const Summary: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <h1>
        <Trans i18nKey="Summary.title" />
      </h1>
      <p>
        <Trans i18nKey="Summary.body" />
      </p>
      <p>
        <Trans i18nKey="Summary.interestedIn" />
        <div>
          <StyledLink href="" text={t('Summary.learnAbout')} external={true} />
        </div>
      </p>
      <p>
        <Trans i18nKey="Summary.submitAnother" />
        <ButtonLink label={t('Summary.startNew')} href="/" style="outline" />
      </p>
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
