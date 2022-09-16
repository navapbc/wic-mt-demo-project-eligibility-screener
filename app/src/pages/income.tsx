import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

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
      <h1>{t('Income.header')}</h1>
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
      <br />
      <h2>{t('Income.householdSize')}</h2>
      <Accordion
        body={t('Income.accordionBody')}
        header={t('Income.accordionHeader')}
      />
      <Dropdown
        id="income"
        label={t('Income.dropdownLabel')}
        handleChange={handleChange}
        options={householdSizes}
      />
      <div className="width-mobile">
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
              <TD data-label="Monthly">
                {(householdSize && incomeData[householdSize]?.monthly) ||
                  '$X,XXX'}
              </TD>
              <TD data-label="Bi-weekly">
                {(householdSize && incomeData[householdSize]?.biweekly) ||
                  '$X,XXX'}
              </TD>
              <TD data-label="Weekly">
                {(householdSize && incomeData[householdSize]?.weekly) ||
                  '$X,XXX'}
              </TD>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <StyledLink
          href="https://dphhs.mt.gov/Assistance"
          text={t('Income.assistance')}
          external={true}
        />
      </p>
      <br />
      <ButtonLink href="/clinic" label={t('continue')} />
      <br />
    </>
  )
}

const TD = styled.td`
  min-width: 20rem;
`

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Income
