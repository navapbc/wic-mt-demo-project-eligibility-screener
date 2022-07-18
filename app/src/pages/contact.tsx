import styled from 'styled-components'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '../components/ButtonLink'

const Contact: NextPage = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Label className="usa-label" htmlFor="input-type-text">{t('Contact.firstName')}</Label>
      <Input className="usa-input" />
      <br />
      <Label className="usa-label" htmlFor="input-type-text">{t('Contact.lastName')}</Label>
      <Input className="usa-input" />
      <br />
      <Label className="usa-label" htmlFor="input-type-text">{t('Contact.phone')}</Label>
      <Input className="usa-input" />
      <Helper>{t('Contact.phoneHelper')}</Helper>
      <br />
      <Label className="usa-label" htmlFor="input-type-textarea">{t('Contact.other')}</Label>
      <Input className="usa-input" />
      <br />
      <br />
      <ButtonLink
        href="/"
        label={t('Contact.button')}
        width="100px"
      />
    </>
  )
}

const Helper = styled.div`
  color: #666666;
  font-size: 12px;
  max-width: 30rem;
  padding: 9px;
}
`

const Input = styled.input`
  border: 1px solid #B3B3B3;
  border-radius: 4px;
  height: 48px;
`

const Label = styled.label`
  font-family: 'Balsamiq Sans',cursive;
  font-size: 20px;
`

export const getServerSideProps: GetServerSideProps = async({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common']))
    }
  }
}

export default Contact
