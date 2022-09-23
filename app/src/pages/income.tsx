import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useState } from 'react'

import Accordion from '@components/Accordion'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'
import RequiredQuestionStatement from '@components/RequiredQuestionStatement'
import StyledLink from '@components/StyledLink'

const Income: NextPage = () => {
  const { t } = useTranslation('common')
  const [householdSize, setHouseholdSize] = useState<keyof typeof incomeData>()
  const householdSizes: string[] = Object.keys(incomeData)
  const incomePeriods: string[] = ['annual', 'monthly', 'biweekly', 'weekly']

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement> & {
      target: { value: keyof typeof incomeData }
    }
  ) => {
    setHouseholdSize(e.target.value)
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
            id="income"
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
                {incomePeriods.map((key: string) => (
                  <th scope="col">{t(`Income.incomePeriods.${key}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {incomePeriods.map((key: string) => (
                  <td data-label={t(`Income.incomePeriods.${key}`)} scope="col">
                    {(householdSize &&
                      incomeData[householdSize][
                        key as keyof typeof incomeData[1]
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
        <ButtonLink href="/clinic" labelKey="continue" />
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
