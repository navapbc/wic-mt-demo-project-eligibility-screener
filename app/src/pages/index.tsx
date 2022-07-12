import { NextPage } from 'next'
import { useTranslations } from 'next-intl'

import ButtonLink from '../components/ButtonLink'

const Index: NextPage = () => {
  const t = useTranslations('Index')
  const listCopyKeys: string[] = ['benefits', 'supplement', 'voluntary']

  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('header')}</p>
      <ul className="usa-list">
        {listCopyKeys.map((key: string) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
      <p>{t('time')}</p>
      <br />
      <ButtonLink href="/information" label={t('button')} vector width="159px" />
    </>
  )
}

export default Index
