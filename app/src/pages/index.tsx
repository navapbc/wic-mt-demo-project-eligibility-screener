import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'

const Index: NextPage = () => {
  // @TODO: think about way to consolidate keys. perhaps don't auto-sort the translation file
  //        and using https://www.i18next.com/translation-function/objects-and-arrays
  const listCopyKeys: string[] = ['benefits', 'supplement', 'voluntary']

  return (
    <>
      <h1>
        <Trans i18nKey="Index.title" />
      </h1>
      <Trans i18nKey="Index.header" />
      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>
            <Trans i18nKey={`Index.${key}`} />
          </li>
        ))}
      </ul>
      <Trans i18nKey="Index.time" />
      <ButtonLink href="/how-it-works" labelKey="Index.button" />
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
