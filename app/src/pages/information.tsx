import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'

const Information: NextPage = () => {
  const { t } = useTranslation('common')
  const listCopyKeys: string[] = ['apply', 'eligible', 'appointment']

  return (
    <>
      <BackLink href="/" />
      <h1>{t('Information.title')}</h1>
      <ol className="usa-process-list">
        {listCopyKeys.map((key: string) => (
          <li className="usa-process-list__item" key={key}>
            <h2 className="usa-process-list__heading">
              {t(`Information.${key}Header`)}
            </h2>
            <p className="margin-top-1">
              <Trans i18nKey={`Information.${key}`} />
            </p>
          </li>
        ))}
      </ol>
      <Alert alertBody="Information.note" type="warning" />
      <ButtonLink href="/eligibility" labelKey="Information.button" />
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
