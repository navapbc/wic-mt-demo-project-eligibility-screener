import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import OverviewTables from '@components/OverviewTables'

const Review: NextPage = () => {

  return (
    <>
      <h1><Trans i18nKey="Review.title" /></h1>
      <p><Trans i18nKey="Review.subHeader" /></p>
      <OverviewTables editable />
      <ButtonLink href="/summary" labelKey="Review.button" />
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
