import type { IncomeData, ModifySessionProps } from '@customTypes/common'
import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'

import Accordion from '@components/Accordion'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import StyledLink from '@components/StyledLink'

type IncomeTableData = {
  [key: string]: string
}

const Income: NextPage<ModifySessionProps> = (props: ModifySessionProps) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state with the value in session.
  const [form, setForm] = useState<IncomeData>(session.income)
  // Use useEffect() to properly load the data from session storage during react hydration.
  useEffect(() => {
    setForm(session.income)
  }, [session.income])

  /* Set some constant keys. */
  // Get the allowed household sizes from the json file.
  const householdSizes: string[] = Object.keys(incomeData)
  // Get the list of allowed income periods.
  const incomePeriods: string[] = Object.keys(incomeData['1'])
  // This is the placeholder income string.
  const placeholderIncomeString = '$XX,XXX'
  // Set up the placeholder array for all periods.
  const placeholderIncomeTable: IncomeTableData = {
    annual: placeholderIncomeString,
    biweekly: placeholderIncomeString,
    monthly: placeholderIncomeString,
    weekly: placeholderIncomeString,
  }
  // Set up state for the income table.
  const [incomeTable, setIncomeTable] = useState<typeof placeholderIncomeTable>(
    placeholderIncomeTable
  )
  // Function to update the income table state.
  // Use useEffect() to properly load the data from session storage during react hydration
  // Since we need to use useEffect to update this state, this also handles anytime the
  // form state is updated, so we don't need to call the same function in handleChange().
  useEffect(() => {
    const getUpdatedIncomeTable = (householdSize: string) => {
      const tempIncomeTable = { ...incomeTable }
      incomePeriods.forEach((period: string) => {
        const castHouseholdSize = householdSize as keyof typeof incomeData
        const castIncomePeriod = period as keyof typeof incomeData['1']
        if (householdSizes.includes(householdSize)) {
          tempIncomeTable[period] =
            incomeData[castHouseholdSize][castIncomePeriod]
        } else {
          tempIncomeTable[period] = placeholderIncomeString
        }
      })
      return tempIncomeTable
    }

    const newIncomeTable = getUpdatedIncomeTable(form.householdSize)
    setIncomeTable(newIncomeTable)
  })

  // Initialize translations.
  const { t } = useTranslation('common')

  // Function to check whether all the required fields in this form
  // page have been filled out.
  // @TODO: This could be further refactored to be more generic.
  const isRequiredMet = (formToCheck: IncomeData) => {
    return formToCheck.householdSize !== ''
  }

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
  // Set up routing to determine if the user is reviewing previously entered data.
  const router = useRouter()
  // If the user is reviewing previously entered data, use the review button.
  // Otherwise, use the default button.
  // const [continueBtn, setContinueBtn] = useState(
  //   router.query.mode === 'review' ? reviewActionButton : defaultActionButton
  // )
  const continueBtn =
    router.query.mode === 'review' ? reviewActionButton : defaultActionButton

  // Set a state for whether the form requirements have been met and the
  // form can be submitted. Otherwise, disable the submit button.
  const [disabled, setDisabled] = useState(true)
  // Use useEffect() to properly load the data from session storage during react hydration
  // Since we need to use useEffect to update this state, this also handles anytime the
  // form state is updated, so we don't need to call the same function in handleChange().
  useEffect(() => {
    setDisabled(!isRequiredMet(form))
  }, [form])

  // Handle form element changes.
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name }: { value: string; name: string } = e.target

    const newForm = { ...form, [name]: value }
    // Update the income state.
    setForm(newForm)
    // Update the session storage state.
    setSession({ ...session, income: newForm })

    // Handle button routing.
    // setContinueBtn({ ...continueBtn, route: getRouting() })
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
            <Trans i18nKey="Income.householdSize" />
          </h2>
          <Accordion
            bodyKey={'Income.accordionBody'}
            headerKey={'Income.accordionHeader'}
          />
          <Dropdown
            id="householdSize"
            labelKey="Income.dropdownLabel"
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
              <tr>
                {incomePeriods.map((period: string) => (
                  <td
                    data-label={t(`Income.incomePeriods.${period}`)}
                    key={period}
                  >
                    {incomeTable[period]}
                  </td>
                ))}
              </tr>
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
