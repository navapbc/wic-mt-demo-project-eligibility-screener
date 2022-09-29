import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'

const Alternate: NextPage = () => {
  return (
    <>
      <BackLink href="/eligibility" />
      <h1>
        <Trans i18nKey="Alternate.title" />
      </h1>
      <h2>
        <Trans i18nKey="Alternate.subHeader" />
      </h2>
      <Trans
        components={[<a key="0" href="https://dphhs.mt.gov/Assistance" />]}
        i18nKey={'Alternate.assistance'}
      />
      <Trans
        components={[<a key="0" href="https://www.signupwic.com/" />]}
        i18nKey={'Alternate.location'}
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
