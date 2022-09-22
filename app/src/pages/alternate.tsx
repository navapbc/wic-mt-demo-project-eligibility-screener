import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'

const Alternate: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <BackLink href="/eligibility" />
      <h1>{t('Alternate.title')}</h1>
      <h2>{t('Alternate.subHeader')}</h2>
      <Trans
        components={[<a key="0" href="https://dphhs.mt.gov/Assistance" />]}
        i18nKey={'Alternate.assistance'}
      />
      <Trans
        components={[<a key="0" href="https://www.signupwic.com/" />]}
        i18nKey={'Alternate.location'}
        t={t}
      />
      <ButtonLink href="/" labelKey="Alternate.button" />
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

export default Alternate
