import { useAppContext } from '@context/state'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEventHandler, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import TextArea from '@components/TextArea'
import TextInput from '@components/TextInput'

interface Props {
  previousRoute: string
}

const Contact: NextPage<Props> = (props: Props) => {
  const { t } = useTranslation('common')
  const { session, setSession } = useAppContext()
  const [form, setForm] = useState(session?.contact)
  const [continueBtn, setContinueBtn] = useState<{
    labelKey: string
  }>({ labelKey: 'continue' })

  useEffect(() => {
    const prevRouteIndex = props.previousRoute.lastIndexOf('/')
    const previousRoute = props.previousRoute.substring(prevRouteIndex)

    if (previousRoute === '/review') {
      setContinueBtn({
        labelKey: 'updateAndReturn',
      })
    }
  }, [props.previousRoute, t])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value, id }: { value: string; id: string } = e.target
    const castId = id as keyof typeof form
    const newForm = { ...form, [castId]: value }

    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  const handleChangeTextArea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value, id }: { value: string; id: string } = e.target
    const castId = id as keyof typeof form
    const newForm = { ...form, [castId]: value }

    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  return (
    <>
      <BackLink href="/clinic" />
      <form className="usa-form usa-form--large">
        <h1>{t('Contact.title')}</h1>
        <p>
          {t('asterisk')} (
          <abbr className="usa-hint usa-hint--required">*</abbr>
          ).
        </p>
        <fieldset className="usa-fieldset">
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
        </fieldset>
        <fieldset className="usa-fieldset">
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
        </fieldset>
        <fieldset className="usa-fieldset">
          <h2>{t('Contact.other')}</h2>
          <TextArea
            handleChange={handleChangeTextArea}
            id="other"
            label={t('Contact.otherLabel')}
            value={form.other}
          />
        </fieldset>
        <ButtonLink href="/review" labelKey={continueBtn.labelKey} />
      </form>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  return {
    props: {
      previousRoute: req.headers.referer,
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Contact
