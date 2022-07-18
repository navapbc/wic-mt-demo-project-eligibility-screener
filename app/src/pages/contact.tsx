import styled from 'styled-components'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { ChangeEvent, useState } from 'react'
import NumberFormat from 'react-number-format'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ButtonLink from '@components/ButtonLink'
import TextInput from '@components/TextInput'

const Contact: NextPage = () => {
  const { t } = useTranslation('common')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    other: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id }: { value: string, id: string } = e.target
    const castId = id as keyof typeof form

    setForm({
      ...form,
      [castId]: value
    })
  }

  return (
    <form>
      <TextInput
        handleChange={handleChange}
        id='firstName'
        label={t('Contact.firstName')}
        value={form.firstName}
      />
      <br />
      <TextInput
        handleChange={handleChange}
        id='lastName'
        label={t('Contact.lastName')}
        value={form.lastName}
      />
      <br />
      <Label className="usa-label" htmlFor="phone">{t('Contact.phone')}</Label>
      <PhoneInput format="###-###-####" mask="_" role='textbox' className="usa-input" id='phone' value={form.phone} onChange={handleChange}/>
      <Helper>{t('Contact.phoneHelper')}</Helper>
      <br />
      <TextInput
        handleChange={handleChange}
        id='other'
        label={t('Contact.other')}
        value={form.other}
      />
      <br />
      <br />
      <ButtonLink
        href="/"
        label={t('Contact.button')}
        width="100px"
      />
    </form>
  )
}

const Helper = styled.div`
  color: #666666;
  font-size: 12px;
  max-width: 30rem;
  padding: 9px;
}
`

const Label = styled.label`
  font-family: 'Balsamiq Sans',cursive;
  font-size: 20px;
`

const PhoneInput = styled(NumberFormat)`
  border: 1px solid #B3B3B3;
  border-radius: 4px;
  height: 48px;
`

export const getServerSideProps: GetServerSideProps = async({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common']))
    }
  }
}

export default Contact
