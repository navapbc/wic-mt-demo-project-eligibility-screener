import incomeData from '@public/data/income.json'
import type { GetServerSideProps, GetServerSidePropsResult, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import Accordion from '@components/Accordion'
import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'

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
      <Link href="/eligibility">Back</Link>
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
        <a className="usa-link" href="https://dphhs.mt.gov/Assistance">
          {t('Income.assistance')}
        </a>
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

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  const prevRouteIndex = req.headers.referer?.lastIndexOf('/')
  const previousRoute = prevRouteIndex && req.headers.referer?.substring(prevRouteIndex)
  let returnval: GetServerSidePropsResult<{ [key: string]: any; }> = {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }

  if (!['/eligibility', '/clinic'].includes(previousRoute)) {
    returnval = {
      ...returnval,
      redirect: {
        destination: previousRoute || '/',
        permanent: false,
      }
    } 
  }

  return returnval
}

export default Income
