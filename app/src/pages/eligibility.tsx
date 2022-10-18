import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

import type { EditablePage, EligibilityData } from '@src/types'
import { initialEligibilityData } from '@utils/sessionData'

// @TODO: none of the above checkboxes
const Eligibility: NextPage<EditablePage> = (props: EditablePage) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state using blank values.
  const [form, setForm] = useState<EligibilityData>(initialEligibilityData)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setForm(session.eligibility)
  }, [session.eligibility])

  // Function to check whether all the required fields in this form
  // page have been filled out.
  // @TODO: This could be further refactored to be more generic.
  const isRequiredMet = (formToCheck: EligibilityData) => {
    return (
      formToCheck.residential !== '' &&
      formToCheck.categorical.length > 0 &&
      formToCheck.previouslyEnrolled !== '' &&
      formToCheck.adjunctive.length > 0
    )
  }

  // Function to update button route.
  // Route the user to /other-benefits if they do not meet basic eligibility requirements.
  // Route the user to /income if they do not meet adjunctive eligibility requirements.
  // Otherwise, route the user to /choose-clinic.
  const getRouting = useCallback((formToCheck: EligibilityData) => {
    let nextPage = '/other-benefits'

    // Short circuit early if the requirements are not met.
    if (!isRequiredMet(formToCheck)) {
      return nextPage
    }

    const isResident = formToCheck.residential === 'yes'
    const hasCategory =
      !formToCheck.categorical.includes('none') &&
      formToCheck.categorical.length > 0
    if (isResident && hasCategory) {
      if (formToCheck.adjunctive.includes('none')) {
        nextPage = '/income'
      } else {
        nextPage = '/choose-clinic'
      }
    }
    return nextPage
  }, [])

  // Set up action button and routing.
  const router = useRouter()
  const actionButtonLabel =
    router.query.mode === 'review' ? 'updateAndReturn' : 'continue'
  const [actionButtonRoute, setActionButtonRoute] = useState(
    router.query.mode === 'review' ? '/review' : getRouting(form)
  )
  // Use useEffect() to set the proper route on page mount.
  useEffect(() => {
    setActionButtonRoute(getRouting(form))
  }, [form, getRouting])

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration
  // Since we need to use useEffect to update the enabled/disabled state for the button,
  // this also handles anytime the form state is updated, so we don't need to call
  // setDisabled during handleChange()
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form])

  // Handle all form element changes.
  // - Determine new form values
  // - Update the form and session states
  // - Update the action button and routing for which page the user should be
  //   routed to based on user-entered data
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name, type }: { value: string; name: string; type: string } =
      e.target
    let newForm

    // Handle radio buttons and checkboxes need to be handled differently.
    // Radio buttons are a boolean setting, so override the existing value.
    if (type === 'radio') {
      newForm = { ...form, [name]: value }
    }
    // Checkboxes are an array because multiple options are accepted,
    // so manage the array elements.
    else if (type === 'checkbox') {
      // Cast the name as a key in form.
      // @TODO: refactor to not hard code
      const castName = name as 'categorical' | 'adjunctive'
      // If the checkbox is checked and that checkbox value isn't in the array,
      // add it to the array.
      // @TODO: consider using Immer
      if (e.target.checked && !form[castName].includes(value)) {
        const checkboxArray = [...form[castName]]
        checkboxArray.push(value)
        newForm = { ...form, [castName]: checkboxArray }
      }
      // If the checkbox is unchecked and the checkbox value IS in the array,
      // remove it from the array.
      else if (!e.target.checked && form[castName].includes(value)) {
        const checkboxArray = form[castName].filter((element) => {
          return element !== value
        })
        newForm = { ...form, [castName]: checkboxArray }
      }
    }

    // Update state if there are changes to update.
    if (newForm) {
      // Update the eligibility state.
      setForm(newForm)
      // Update the session storage state.
      setSession({ ...session, eligibility: newForm })
    }
  }

  return (
    <>
      <BackLink href="/how-it-works" />
      <h1>
        <Trans i18nKey="Eligibility.header" />
      </h1>
      <RequiredQuestionStatement />
      <form className="usa-form usa-form--large">
        <InputChoiceGroup
          required
          titleKey="Eligibility.residential"
          type="radio"
          choices={['yes', 'no'].map((option) => {
            return {
              checked: form.residential === option,
              handleChange: handleChange,
              labelKey: `Eligibility.${option}`,
              name: 'residential',
              value: option,
            }
          })}
        />
        <InputChoiceGroup
          accordion={{
            bodyKey: 'Eligibility.accordionBody',
            headerKey: 'Eligibility.accordionHeader',
          }}
          required
          titleKey="Eligibility.categorical"
          type="checkbox"
          choices={[
            'pregnant',
            'baby',
            'child',
            'guardian',
            'loss',
            'none',
          ].map((option) => {
            return {
              checked: form.categorical.includes(option),
              handleChange: handleChange,
              labelKey: `Eligibility.${option}`,
              name: 'categorical',
              value: option,
            }
          })}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.previouslyEnrolled"
          type="radio"
          choices={['yes', 'no'].map((option) => {
            return {
              checked: form.previouslyEnrolled === option,
              handleChange: handleChange,
              labelKey: `Eligibility.${option}`,
              name: 'previouslyEnrolled',
              value: option,
            }
          })}
        />
        <InputChoiceGroup
          required
          titleKey="Eligibility.programs"
          type="checkbox"
          choices={['insurance', 'snap', 'tanf', 'fdpir', 'none'].map(
            (option) => {
              return {
                checked: form.adjunctive.includes(option),
                handleChange: handleChange,
                labelKey: `Eligibility.${option}`,
                name: 'adjunctive',
                value: option,
              }
            }
          )}
        />
        <ButtonLink
          href={actionButtonRoute}
          labelKey={actionButtonLabel}
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

export default Eligibility
