import { NextPage } from 'next'
import { useTranslations } from 'next-intl'

import Button from '../components/Button'

const Index: NextPage = () => {
  const t = useTranslations('Index')
  const listCopyKeys: string[] = ['benefits', 'supplement', 'voluntary']

  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('header')}</p>
      <ul className='usa-list'>
        {
          listCopyKeys.map((key: string) => (
            <li key={key}>{t(key)}</li>
          ))
        }
      </ul>
      <p>{t('time')}</p>
      <br />
      <Button
        href='/information'
        text={t('button')}
        vector
        width="159px"
      />
    </>
  )
}

export default Index