import type { EligibilityData, ModifySessionProps } from '@customTypes/common'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import InputChoiceGroup from '@components/InputChoiceGroup'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'

const Eligibility: NextPage<ModifySessionProps> = (
  props: ModifySessionProps
) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state with the value in session.
  const [form, setForm] = useState<EligibilityData>(session.eligibility)

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
  const getRouting = (formToCheck: EligibilityData) => {
    const isResident = formToCheck.residential === 'yes'
    const hasCategory = !formToCheck.categorical.includes('none')
    if (!isResident || !hasCategory) {
      return '/other-benefits'
    } else if (formToCheck.adjunctive.includes('none')) {
      return '/income'
    } else {
      return '/choose-clinic'
    }
  }

  // Set up action button and routing.
  const defaultActionButton = {
    labelKey: 'continue',
    route: getRouting(form),
  }
  const reviewActionButton = {
    labelKey: 'updateAndReturn',
    route: '/review',
  }
  // Set up routing to determine if the user is reviewing previously entered data.
  const router = useRouter()
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const [continueBtn, setContinueBtn] = useState(
    router.query.mode === 'review' ? reviewActionButton : defaultActionButton
  )

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState()
  // Hydrate this state properly based on local storage.
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form])

  // Handle all form element changes.
  // - Determine new form values
  // - Update the form and session states
  // - Update whether the action button is disabled based on whether all
  //   required fields have been filled out
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
      const castName = name as 'categorical' | 'adjunctive'
      // If the checkbox is checked and that checkbox value isn't in the array,
      // add it to the array.
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
      // Handle button routing.
      setContinueBtn({ ...continueBtn, route: getRouting(newForm) })
      // Update whether the submit button is enabled or disabled.
      setDisabled(!isRequiredMet(newForm))
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
          href={continueBtn.route}
          labelKey={continueBtn.labelKey}
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
