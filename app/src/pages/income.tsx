import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import dynamic from 'next/dynamic'
import { ChangeEvent, useEffect, useState } from 'react'

import Accordion from '@components/Accordion'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import StyledLink from '@components/StyledLink'

import type { EditablePage, IncomeData } from '@src/types'
import { isValidIncome } from '@utils/dataValidation'
import { initialIncomeData } from '@utils/sessionData'

// Dynamically load the <IncomeRow> component to prevent SSR hydration conflicts.
const IncomeRow = dynamic(() => import('@components/IncomeRow'), {
  ssr: false,
})

const Income: NextPage<EditablePage> = (props: EditablePage) => {
  // Get the session from props.
  const { session, setSession, reviewMode = false } = props
  // Initialize form as a state with blank values.
  const [form, setForm] = useState<IncomeData>(initialIncomeData)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setForm(session.income)
  }, [session.income])

  // Function to check whether all the required fields in this page have been filled out.
  const isRequiredMet = isValidIncome

  // Function to update button route.
  const getRouting = () => {
    return '/choose-clinic'
  }

  // Set up action button and routing.
  const defaultActionButton = {
    labelKey: 'continue',
    route: getRouting(),
  }
  const reviewActionButton = {
    labelKey: 'updateAndReturn',
    route: '/review',
  }
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  const continueBtn = reviewMode ? reviewActionButton : defaultActionButton

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration
  // Since we need to use useEffect to update this state, this also handles anytime the
  // form state is updated, so we don't need to call the same function in handleChange().
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form, isRequiredMet])

  // Page-specific consts.
  // Get the allowed household sizes from the json file.
  const householdSizes: string[] = Object.keys(incomeData)
  // Get the list of allowed income periods.
  const incomePeriods: string[] = Object.keys(
    incomeData[householdSizes[0] as keyof typeof incomeData]
  )
  // Initialize translations.
  const { t } = useTranslation('common')

  // Handle form element changes.
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name }: { value: string; name: string } = e.target

    const newForm = { ...form, [name]: value }
    // Update the income state.
    setForm(newForm)
    // Update the session storage state.
    setSession({ ...session, income: newForm })
  }

  return (
    <>
      <BackLink href="/eligibility" />
      <h1>
        <Trans i18nKey="Income.header" />
      </h1>
      <RequiredQuestionStatement />

      <div className="content-group">
        <h2>
          <Trans i18nKey="Income.title" />
        </h2>
        <p>
          <Trans i18nKey="Income.enrolled" />
        </p>
        <p>
          <Trans i18nKey="Income.notEnrolled" />
        </p>
        <p>
          <Trans i18nKey="Income.unsure" />
        </p>
      </div>

      <form className="usa-form usa-form--large">
        <fieldset className="usa-fieldset">
          <h2>
            <Trans i18nKey="Income.householdSizeHeader" />
          </h2>
          <Accordion
            bodyKey={'Income.accordionBody'}
            headerKey={'Income.accordionHeader'}
          />
          <Dropdown
            id="householdSize"
            labelKey="Income.householdSize"
            handleChange={handleChange}
            options={householdSizes}
            required={true}
            selectedOption={form.householdSize}
          />
        </fieldset>

        <fieldset className="usa-fieldset">
          <table className="usa-table usa-table--stacked usa-table--borderless">
            <caption>
              <h2>
                <Trans i18nKey="Income.estimatedIncome" />
              </h2>
            </caption>
            <thead>
              <tr>
                {incomePeriods.map((period: string) => (
                  <th scope="col" key={period}>
                    {t(`Income.incomePeriods.${period}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <IncomeRow
                periods={incomePeriods}
                householdSize={form.householdSize}
                incomeForHouseholdSize={
                  incomeData[form.householdSize as keyof typeof incomeData]
                }
              />
            </tbody>
          </table>
          <p>
            <StyledLink
              href="https://dphhs.mt.gov/Assistance"
              textKey="Income.assistance"
              external={true}
            />
          </p>
        </fieldset>
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

export default Income
