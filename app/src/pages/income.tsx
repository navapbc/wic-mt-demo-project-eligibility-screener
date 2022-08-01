import incomeData from '@public/data/income.json'
import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import ButtonLink from '@components/ButtonLink'
import Dropdown from '@components/Dropdown'

const Income: NextPage = () => {
  const { t } = useTranslation('common')
  const [householdSize, setHouseholdSize] = useState<keyof typeof incomeData>()
  // @ts-ignore TODO: PAIR WITH ROCKET ON THIS
  const householdSizes: keyof typeof incomeData[] = Object.keys(incomeData)

  const handleChange = (e: ChangeEvent<HTMLSelectElement> & { target: { value: keyof typeof incomeData }}) => {
    setHouseholdSize(e.target.value) 
  }

  return (
    <>
      <h1>{t('Income.title')}</h1>
      <p>{t('Income.enrolled')}</p>
      <p>{t('Income.notEnrolled')}</p>
      <Dropdown
        id="income"
        label={t('Income.dropdownLabel')}
        // @ts-ignore
        handleChange={handleChange}
        // @ts-ignore
        options={householdSizes}
      />
      <Helper>{t('Income.helper')}</Helper>
      <Table className="usa-table usa-table--borderless">
        <caption>
          <h2>{t('Income.estimatedIncome')}</h2>
        </caption>
        <thead>
          <tr>
            <th scope="col">Annual</th>
            <th scope="col">Monthly</th>
            <th scope="col">Weekly</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">{householdSize && incomeData[householdSize]?.annual || '-'}</th>
            <td>{householdSize && incomeData[householdSize]?.monthly || '-'}</td>
            <td>{householdSize && incomeData[householdSize]?.weekly || '-'}</td>
          </tr>
        </tbody>
      </Table>
      <p>
        <a className="usa-link" href="https://dphhs.mt.gov/Assistance">
          Learn about other assistance
        </a>
      </p>
      <br />
      <ButtonLink href="/clinic" label={t('continue')} vector width="140px" />
    </>
  )
}

const Helper = styled.div`
  color: #666666;
  font-size: 12px;
  max-width: 30rem;
  padding: 9px;
}`

const Table = styled.table`
  h2 {
    font-family: 'Balsamiq Sans', cursive;
  }
  font-family: 'Balsamiq Sans', cursive;
  width: 70%;
`

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Income
