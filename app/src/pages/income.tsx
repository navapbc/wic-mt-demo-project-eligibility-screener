import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useState } from 'react'

import Accordion from '@components/Accordion'
import BackLink from '@components/BackLink'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'
import StyledLink from '@components/StyledLink'

const Income: NextPage = () => {
  const { t } = useTranslation('common')
  const [householdSize, setHouseholdSize] = useState<keyof typeof incomeData>()
  const householdSizes: string[] = Object.keys(incomeData)

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
      <p>
        {t('asterisk')} (<abbr className="usa-hint usa-hint--required">*</abbr>
        ).
      </p>

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

      <div className="content-group">
        <h2>{t('Income.householdSize')}</h2>
        <Accordion
          bodyKey={'Income.accordionBody'}
          headerKey={'Income.accordionHeader'}
        />
        <Dropdown
          id="income"
          label={t('Income.dropdownLabel')}
          handleChange={handleChange}
          options={householdSizes}
          required={true}
        />
      </div>

      <div className="width-mobile content-group">
        <table className="usa-table usa-table--stacked usa-table--borderless">
          <caption>
            <h2>{t('Income.estimatedIncome')}</h2>
          </caption>
          <thead>
            <tr>
              <th scope="col">Annual</th>
              <th scope="col">Monthly</th>
              <th scope="col">Bi-weekly</th>
              <th scope="col">Weekly</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th data-label="Annual" scope="row">
                {(householdSize && incomeData[householdSize]?.annual) ||
                  '$XX,XXX'}
              </th>
              <td data-label="Monthly">
                {(householdSize && incomeData[householdSize]?.monthly) ||
                  '$X,XXX'}
              </td>
              <td data-label="Bi-weekly">
                {(householdSize && incomeData[householdSize]?.biweekly) ||
                  '$X,XXX'}
              </td>
              <td data-label="Weekly">
                {(householdSize && incomeData[householdSize]?.weekly) ||
                  '$X,XXX'}
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <StyledLink
            href="https://dphhs.mt.gov/Assistance"
            text={t('Income.assistance')}
            external={true}
          />
        </p>
      </div>
      <ButtonLink href="/clinic" label={t('continue')} />
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
