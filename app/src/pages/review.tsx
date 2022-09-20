import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'

const Review: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <h1>{t('Review.title')}</h1>
      <p>{t('Review.subHeader')}</p>
      <OverviewTables editable />
      <ButtonLink href="/summary" label={t('Review.button')} />
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

export default Review
