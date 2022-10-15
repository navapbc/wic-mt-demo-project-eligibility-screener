import { ComponentMeta, ComponentStory } from '@storybook/react'

import IncomeRowComponent from '@components/IncomeRow'

export default {
  title: 'Components',
  component: IncomeRowComponent,
} as ComponentMeta<typeof IncomeRowComponent>

const Template: ComponentStory<typeof IncomeRowComponent> = (args) => (
  <IncomeRowComponent {...args} />
)

export const IncomeRow = Template.bind({})

IncomeRow.args = {
  periods: ['hourly', 'daily'],
  householdSize: '',
  incomeForHouseholdSize: { hourly: 'amount a', daily: 'amount b' },
}
