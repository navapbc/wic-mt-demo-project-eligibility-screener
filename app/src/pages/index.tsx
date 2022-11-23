import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import TransLine from '@components/TransLine'

import type { Page } from '@src/types'

const Index: NextPage<Page> = (props: Page) => {
  const { forwardRoute = '' } = props
  // @TODO: https://wicmtdp.atlassian.net/browse/WMDP-252
  //        Move as much translation content out of code as possible.
  //        Consider removing auto-sort on translation files and
  //        using https://www.i18next.com/translation-function/objects-and-arrays.
  const listCopyKeys: string[] = ['benefits', 'supplement', 'voluntary']

  return (
    <>
      <h1>
        <TransLine i18nKey="Index.title" />
      </h1>
      <TransLine i18nKey="Index.header" />
      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>
            <TransLine i18nKey={`Index.${key}`} />
          </li>
        ))}
      </ul>
      <TransLine i18nKey="Index.time" />
      <ButtonLink href={forwardRoute} labelKey="Index.button" />
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
