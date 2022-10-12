import type { IncomeData, ModifySessionProps } from '@customTypes/common'
import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'

import Accordion from '@components/Accordion'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import StyledLink from '@components/StyledLink'

const Income: NextPage<ModifySessionProps> = (props: ModifySessionProps) => {
  // Get the session from props.
  const { session, setSession } = props
  // Initialize form as a state with the value in session.
  const [form, setForm] = useState<IncomeData>(session.income)

  // Set some constant keys.
  const householdSizes: string[] = Object.keys(incomeData)
  const incomePeriods: string[] = ['annual', 'monthly', 'biweekly', 'weekly']

  // Initialize translations.
  const { t } = useTranslation('common')

  // Function to check whether all the required fields in this form
  // page have been filled out.
  // @TODO: This could be further refactored to be more generic.
  const isRequiredMet = (formToCheck: IncomeData) => {
    return formToCheck.householdSize !== ''
  }

  // Function to update button route.
  const getRouting = (formToCheck: IncomeData) => {
    console.log(formToCheck)
    return '/choose-clinic'
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
  const [disabled, setDisabled] = useState(!isRequiredMet(form))

  // Handle form element changes.
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name }: { value: string; name: string } = e.target

    console.log(`name: ${name}, value: ${value}`)

    const newForm = { ...form, [name]: value }
    // Update the income state.
    setForm(newForm)
    // Update the session storage state.
    setSession({ ...session, income: newForm })
    // Handle button routing.
    setContinueBtn({ ...continueBtn, route: getRouting(newForm) })
    // Update whether the submit button is enabled or disabled.
    setDisabled(!isRequiredMet(newForm))
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
                    {(form.householdSize &&
                      incomeData[form.householdSize as keyof typeof incomeData][
                        period as keyof typeof incomeData[1]
                      ]) ||
                      '$XX,XXX'}
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
