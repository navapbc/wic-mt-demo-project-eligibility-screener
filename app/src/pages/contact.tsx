import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Required from '@components/Required'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextField from '@components/TextField'

import type { ContactData, ModifySessionProps } from '@src/types'
import { initialContactData } from '@utils/sessionData'

const Contact: NextPage<ModifySessionProps> = (props: ModifySessionProps) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using the value with default blank values.
  // This prevents bugginess around hydration. DO NOT try to initialize from the session!
  // That can cause fields like <textarea> to not load values correctly.
  const [form, setForm] = useState<ContactData>(initialContactData)
  // Need to use useEffect() to properly load the data from session storage on component mount.
  // This also updates form whenever session is updated, which isn't ideal since
  // we update form AND session in handleChange(), but:
  // 1. React requires session.contact as a dependency
  // 2. We could remove setForm() from handleChange(), but that would put the update first
  //    into sessionStorage before updating state and that is less ideal.
  // Instead, we accept that this runs on component mount and on handleChange(), we run setForm(),
  // then, setSession(), which then calls setForm() a second time.
  useEffect(() => {
    setForm(session.contact)
  }, [session.contact])

  // Function to check whether all the required fields in this form
  // page have been filled out.
  // @TODO: This could be further refactored to be more generic.
  const isRequiredMet = (formToCheck: ContactData) => {
    return (
      formToCheck.firstName !== '' &&
      formToCheck.lastName !== '' &&
      formToCheck.phone !== '' &&
      formToCheck.phone.replace(/[^0-9]/g, '').length === 10
    )
  }

  // Set up action button and routing.
  const defaultActionButtonLabelKey = 'continue'
  const reviewActionButtonLabelKey = 'updateAndReturn'
  // Set up routing to determine if the user is reviewing previously entered data.
  const router = useRouter()
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const continueBtnLabel =
    router.query.mode === 'review'
      ? reviewActionButtonLabelKey
      : defaultActionButtonLabelKey

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form])

  // Handle changes to text and textarea fields.
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const newForm = { ...form, [name]: value }
    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  return (
    <>
      <BackLink href="/choose-clinic" />
      <form className="usa-form usa-form--large">
        <h1>
          <Trans i18nKey="Contact.title" />
        </h1>
        <RequiredQuestionStatement />
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Contact.name" />
            <Required />
          </h2>
          <TextField
            handleChange={handleChange}
            id="firstName"
            labelKey="Contact.firstName"
            required
            value={form.firstName}
          />
          <TextField
            handleChange={handleChange}
            id="lastName"
            labelKey="Contact.lastName"
            required
            value={form.lastName}
          />
        </fieldset>
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Contact.phoneHeader" />
            <Required />
          </h2>
          <Alert alertBody="Contact.phoneAlert" type="info" />
          <label className="usa-label" htmlFor="phone">
            <Trans i18nKey="Contact.phone" />
            <Required />
          </label>
          <NumberFormat
            format="###-###-####"
            mask="_"
            role="textbox"
            className="usa-input"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Contact.commentsHeader" />
          </h2>
          <TextField
            handleChange={handleChange}
            id="comments"
            labelKey="Contact.comments"
            value={form.comments}
            type="textarea"
          />
        </fieldset>
        <ButtonLink
          href="/review"
          labelKey={continueBtnLabel}
          disabled={disabled}
        />
      </form>
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

export default Contact
