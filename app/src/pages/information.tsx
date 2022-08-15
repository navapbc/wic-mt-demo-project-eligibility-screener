import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'

import ButtonLink from '@components/ButtonLink'

const Information: NextPage = () => {
  const { t } = useTranslation('common')
  const listCopyKeys: string[] = ['apply', 'eligible', 'appointment']

  return (
    <>
      <Link href="/">Back</Link>
      <h1>{t('Information.title')}</h1>
      <ol className="usa-process-list">
        {listCopyKeys.map((key: string) => (
          <li className="usa-process-list__item" key={key}>
            <h2 className="usa-process-list__heading">
              {t(`Information.${key}Header`)}
            </h2>
            <p
              className="margin-top-1"
              dangerouslySetInnerHTML={{ __html: t(`Information.${key}`) }}
            />
          </li>
        ))}
      </ol>
      <ButtonLink
        href="/eligibility"
        label={t('Information.button')}
        width="200px"
      />
      <br />
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

export default Information
