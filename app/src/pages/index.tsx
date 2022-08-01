import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'

const Index: NextPage = () => {
  const { t } = useTranslation('common')
  const listCopyKeys: string[] = ['benefits', 'supplement', 'voluntary']

  return (
    <>
      <h1>{t('Index.title')}</h1>
      <p>{t('Index.description')}</p>
      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>{t(`Index.${key}`)}</li>
        ))}
      </ul>
      <p>{t('Index.time')}</p>
      <br />
      <ButtonLink
        href="/information"
        label={t('Index.button')}
        vector
        width="159px"
      />
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

export default Index
