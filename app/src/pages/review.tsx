import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  const previousRoute =
    prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  let returnval: GetServerSidePropsResult<{ [key: string]: object }> = {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }

  if (
    !['/clinic', '/eligibility', '/contact'].includes(previousRoute as string)
  ) {
    returnval = {
      ...returnval,
      redirect: {
        destination: previousRoute || '/',
        permanent: false,
      },
    }
  }

  return returnval
}

export default Review
