import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'

import ButtonLink from '@components/ButtonLink'

const Review: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Link href="/eligibility">Back</Link>
      <h1>{t('Review.title')}</h1>
      <h2>{t('Review.subHeader')}</h2>
      <ButtonLink href="/" label={t('Review.button')} width="180px" />
      <br />
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
