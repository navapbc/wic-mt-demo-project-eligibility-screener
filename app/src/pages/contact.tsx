import { useAppContext } from '@context/state'
import type {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
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
    label: string
  }>({ label: t('continue') })
  const requiredMet = (): boolean => {
    const validPhoneLength = form.phone.replace(/[^0-9]/g, '').length === 10
    return (
      validPhoneLength &&
      ['firstName', 'lastName', 'phone'].every(
        (field) => form[field as keyof typeof form]
      )
    )
  }
  const [disabled, setDisabled] = useState<boolean>(!requiredMet())

  useEffect(() => {
    setDisabled(!requiredMet())
  }, [form])

  useEffect(() => {
    if (props.previousRoute === '/review') {
      setContinueBtn({
        label: t('updateAndReturn'),
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
      <form className="usa-form--large">
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
      </form>
      <ButtonLink href="/review" label={continueBtn.label} disabled={disabled} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  const previousRoute =
    prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  let returnval: GetServerSidePropsResult<{ [key: string]: object | string }> =
    {
      props: {
        previousRoute: previousRoute as string,
        ...(await serverSideTranslations(locale || 'en', ['common'])),
      },
    }

  if (!['/clinic', '/review'].includes(previousRoute as string)) {
    returnval = {
      ...returnval,
      redirect: {
        destination: previousRoute || '/',
        permanent: false,
      },
    }
  }

  return returnval
}

export default Contact
