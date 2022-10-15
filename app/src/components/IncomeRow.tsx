import { ReactElement } from 'react'

type IncomeRowProps = {
  periods: string[]
  householdSize: string
  incomeForHouseholdSize: {
    [key: string]: string
  }
}

const IncomeRow = (props: IncomeRowProps): ReactElement => {
  const { periods, householdSize, incomeForHouseholdSize } = props

  // If the householdSize is not an empty string, then use it
  // to lookup the income amounts for each time period.
  if (householdSize !== '') {
    return (
      <tr>
        {periods.map((period: string) => (
          <td key={period}>{incomeForHouseholdSize[period]}</td>
        ))}
      </tr>
    )
  }
  // Return a placeholder row.
  else {
    return (
      <tr>
        {periods.map((period: string) => (
          <td key={period}>$XX,XXX</td>
        ))}
      </tr>
    )
  }
}

export default IncomeRow