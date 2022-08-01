import type { GetServerSideProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import styled from 'styled-components'

import ButtonLink from '@components/ButtonLink'
import incomeData from '@public/data/income.json'

const Income: NextPage = () => {
  const { t } = useTranslation('common')
  const [householdSize, setHouseholdSize] = useState(undefined)
  const householdSizes: number[] = [1, 2, 3, 4, 5, 6, 7, 8]

  console.log("bang",householdSize)

  return (
    <>
      <h1>{t('Income.title')}</h1>
      <p>{t('Income.enrolled')}</p>
      <p>{t('Income.notEnrolled')}</p>
      <form className="usa-form">
        <label className="usa-label" htmlFor="options"><b>{t('Income.dropdownLabel')}</b></label>
        <select
          className="usa-select"
          id="options"
          onChange={e => { setHouseholdSize(e.target.value)}}
          >
          <option value>- Select -</option>
          { householdSizes.map((size: number) => (
            <option value={size}>{size}</option>
          ))
          }
        </select>
      </form>
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
            <th scope="row">
              {incomeData[householdSize]?.annual || '-'}
            </th>
            <td>
              {incomeData[householdSize]?.monthly || '-'}
            </td>
            <td>
              {incomeData[householdSize]?.weekly || '-'}
            </td>
          </tr>
        </tbody>
      </Table>
      <p>
        <a
          class="usa-link"
          href="https://dphhs.mt.gov/Assistance"
          >Learn about other assistance</a>
      </p>
      <br />
      <ButtonLink
        href="/clinic"
        label={t('continue')}
        vector
        width="140px"
      />
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
  width: 70%
`

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  }
}

export default Income
