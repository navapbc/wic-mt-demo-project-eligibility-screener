import { render, screen } from '@testing-library/react'

import IncomeRow from '@components/IncomeRow'

import { testSnapshot } from '../helpers/sharedTests'

const testProps = {
  periods: ['weekly', 'monthly', 'annual'],
  householdSize: '1',
  incomeForHouseholdSize: {
    weekly: '$100',
    monthly: '$200',
    annual: '$300',
  },
}

it('should match snapshot when householdSize is not empty string', () => {
  testSnapshot(<IncomeRow {...testProps} />)
})

it('should match snapshot when householdSize is an empty string', () => {
  testSnapshot(<IncomeRow {...testProps} householdSize="" />)
})
