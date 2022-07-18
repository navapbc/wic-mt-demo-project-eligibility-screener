import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '../components/ButtonLink'

const Information: NextPage = () => {
  const { t } = useTranslation('common')
  const listCopyKeys: string[] = ['apply', 'eligible', 'appointment']

  return (
    <>
      <h1>{t('Information.title')}</h1>
      <ol className="usa-process-list">
        {listCopyKeys.map((key: string) => (
          <li className="usa-process-list__item" key={key}>
            {t(`Information.${key}`)}
          </li>
        ))}
      </ol>
      <p>{t('Information.note')}</p>
      <br />
      <ButtonLink
        href="/eligibility"
        label={t('Information.button')}
        vector
        width="239px"
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

export default Information
