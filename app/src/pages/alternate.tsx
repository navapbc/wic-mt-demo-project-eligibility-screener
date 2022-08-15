import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import styled from 'styled-components'

import ButtonLink from '@components/ButtonLink'

const Alternate: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Link href="/eligibility">Back</Link>
      <h1>{t('Alternate.title')}</h1>
      <h2>{t('Alternate.subHeader')}</h2>
      <Trans
        components={[<a key="0" href="https://dphhs.mt.gov/Assistance" />]}
        i18nKey={'Alternate.assistance'}
        t={t}
      />
      <br />
      <br />
      <Trans
        components={[<a key="0" href="https://www.signupwic.com/" />]}
        i18nKey={'Alternate.location'}
        t={t}
      />
      <br />
      <br />
      <br />
      <StyledButton href="/" label={t('Alternate.button')} width="180px" />
      <br />
    </>
  )
}

const StyledButton = styled(ButtonLink)`
  margin: 2rem 0;
`

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Alternate
