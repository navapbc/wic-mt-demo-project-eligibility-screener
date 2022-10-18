import { ComponentMeta, ComponentStory } from '@storybook/react'

import IncomeRowComponent from '@components/IncomeRow'

export default {
  title: 'Components',
  component: IncomeRowComponent,
} as ComponentMeta<typeof IncomeRowComponent>

const Template: ComponentStory<typeof IncomeRowComponent> = (args) => (
  <table>
    <thead>
      <tr>
        {args.periods.map((period: string) => (
          <th key={period}>{period}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <IncomeRowComponent {...args} />
    </tbody>
  </table>
)

export const IncomeRow = Template.bind({})

IncomeRow.args = {
  periods: ['hourly', 'daily'],
  householdSize: '1',
  incomeForHouseholdSize: { hourly: 'amount a', daily: 'amount b' },
}
