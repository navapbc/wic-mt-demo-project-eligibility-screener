import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'
import NumberFormat from 'react-number-format'
import { useAppContext } from 'src/context/state'

import ButtonLink from '@components/ButtonLink'
import TextInput from '@components/TextInput'

const Contact: NextPage = () => {
  const { t } = useTranslation('common')
  const { session, setSession } = useAppContext()
  const [form, setForm] = useState(
    (session && session.contact) || {
      contact: {
        firstName: '',
        lastName: '',
        phone: '',
        other: '',
      },
    }
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id }: { value: string; id: string } = e.target
    const castId = id as keyof typeof form
    const newForm = { ...form, [castId]: value }

    setForm(newForm)
    setSession({...session, contact: newForm})
  }

  return (
    <form>
      <Link href="/clinic">Back</Link>
      <h1>{t('Contact.title')}</h1>
      <p>
        {t('asterisk')} (<abbr className="usa-hint usa-hint--required">*</abbr>
        ).
      </p>
      <h2>
        {t('Contact.name')}
        <abbr className="usa-hint usa-hint--required"> *</abbr>
      </h2>
      <TextInput
        handleChange={handleChange}
        id="firstName"
        label={t('Contact.firstName')}
        required
        value={form.firstName}
      />
      <TextInput
        handleChange={handleChange}
        id="lastName"
        label={t('Contact.lastName')}
        required
        value={form.lastName}
      />
      <br />
      <br />
      <h2>
        {t('Contact.phone')}{' '}
        <abbr className="usa-hint usa-hint--required"> *</abbr>
      </h2>
      <div className="usa-alert usa-alert--info usa-alert--no-icon">
        <div className="usa-alert__body">
          <p className="usa-alert__text">{t('Contact.phoneAlert')}</p>
        </div>
      </div>
      <label className="usa-label" htmlFor="phone">
        {t('Contact.phoneLabel')}
        <abbr className="usa-hint usa-hint--required"> *</abbr>
      </label>
      <NumberFormat
        format="###-###-####"
        mask="_"
        role="textbox"
        className="usa-input"
        id="phone"
        value={form.phone}
        onChange={handleChange}
      />
      <br />
      <br />
      <h2>{t('Contact.other')}</h2>
      <TextInput
        handleChange={handleChange}
        id="other"
        label={t('Contact.otherLabel')}
        type="area"
        value={form.other}
      />
      <br />
      <br />
      <ButtonLink href="/review" label={t('continue')} width="105px" />
      <br />
    </form>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Contact
