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
      <p dangerouslySetInnerHTML={{ __html: t('Index.header') }} />
      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>{t(`Index.${key}`)}</li>
        ))}
      </ul>
      <p dangerouslySetInnerHTML={{ __html: t('Index.time') }} />
      <br />
      <ButtonLink href="/information" label={t('Index.button')} width="125px" />
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

export default Index
