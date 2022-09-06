import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import OverviewTables from '@components/OverviewTables'

const Summary: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <h1>{t('Summary.title')}</h1>
      <p>{t('Summary.body')}</p>
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
