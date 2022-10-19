import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Required from '@components/Required'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextField from '@components/TextField'

import type { ContactData, EditablePage } from '@src/types'
import { isValidContact } from '@utils/dataValidation'
import { initialContactData } from '@utils/sessionData'

const Contact: NextPage<EditablePage> = (props: EditablePage) => {
  // Get the session from props.
  const { session, setSession, reviewMode = false } = props
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

  // Function to check whether all the required fields in this page have been filled out.
  const isRequiredMet = isValidContact

  // Set up action button and routing.
  const defaultActionButtonLabelKey = 'continue'
  const reviewActionButtonLabelKey = 'updateAndReturn'
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const continueBtnLabel = reviewMode
    ? reviewActionButtonLabelKey
    : defaultActionButtonLabelKey

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form, isRequiredMet])

  // Handle changes to text and textarea fields.
  const handleChangeEvent = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    handleChange(name, value)
  }

  const handleChange = (name: string, value: string) => {
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
            handleChange={handleChangeEvent}
            id="firstName"
            labelKey="Contact.firstName"
            required
            value={form.firstName}
          />
          <TextField
            handleChange={handleChangeEvent}
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
          <PatternFormat
            format="###-###-####"
            mask="_"
            role="textbox"
            className="usa-input"
            id="phone"
            name="phone"
            value={form.phone}
            onValueChange={(values) => {
              handleChange('phone', values.value)
            }}
            valueIsNumericString={true}
          />
        </fieldset>
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Contact.commentsHeader" />
          </h2>
          <TextField
            handleChange={handleChangeEvent}
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
