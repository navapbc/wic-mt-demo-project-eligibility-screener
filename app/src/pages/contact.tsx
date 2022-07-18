import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '../components/ButtonLink'

const Contact: NextPage = () => {
  const { t } = useTranslation('common')
  const listCopyKeys: string[] = ['apply', 'eligible', 'appointment']

  return (
    <>
      <h2>{t('Contact.firstName')}</h2>
      <h2>{t('Contact.lastName')}</h2>
      <h2>{t('Contact.phone')}</h2>
      <h2>{t('Contact.other')}</h2>
      <ButtonLink
        href="/"
        label={t('Contact.button')}
        width="100px"
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common']))
    }
  }
}

export default Contact
