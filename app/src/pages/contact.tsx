import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'

import Alert from '@components/Alert'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Required from '@components/Required'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import TextArea from '@components/TextArea'
import TextInput from '@components/TextInput'

import type { ContactData, ModifySessionProps } from '@src/types'

// @TODO: seems buggy
const Contact: NextPage<ModifySessionProps> = (props: ModifySessionProps) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using the value in session.
  const [form, setForm] = useState<ContactData>(session.contact)
  // Use useEffect() to properly load the data from session storage during react hydration.
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

  // @TODO: Refactor these two into a single event handler.
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name }: { value: string; name: string } = e.target
    const newForm = { ...form, [name]: value }

    setForm(newForm)
    setSession({ ...session, contact: newForm })
  }

  const handleChangeTextArea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value, name }: { value: string; name: string } = e.target
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
          <TextInput
            handleChange={handleChange}
            id="firstName"
            labelKey="Contact.firstName"
            required
            value={form.firstName}
          />
          <TextInput
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
            onInput={handleChange}
          />
        </fieldset>
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Contact.commentsHeader" />
          </h2>
          <TextArea
            handleChange={handleChangeTextArea}
            id="comments"
            labelKey="Contact.comments"
            value={form.comments}
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
