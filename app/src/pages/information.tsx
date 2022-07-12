import { NextPage } from 'next'
import { useTranslations } from 'next-intl'

import ButtonLink from '../components/ButtonLink'

const Information: NextPage = () => {
  const t = useTranslations('Information')
  const listCopyKeys: string[] = ['apply', 'eligible', 'appointment']

  return (
    <>
      <h1>{t('title')}</h1>
      <ol className="usa-process-list">
        {listCopyKeys.map((key: string) => (
          <li className="usa-process-list__item" key={key}>
            {t(key)}
          </li>
        ))}
      </ol>
      <p>{t('note')}</p>
      <br />
      <ButtonLink
        href="/eligibility"
        label={t('button')}
        vector
        width="239px"
      />
    </>
  )
}

export default Information
