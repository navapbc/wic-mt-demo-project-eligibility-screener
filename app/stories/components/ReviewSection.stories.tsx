import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewSectionComponent from '@components/ReviewSection'

import { getMockSessionData } from '@lib/mockData'

export default {
  title: 'Components/ReviewSection',
  component: ReviewSectionComponent,
} as ComponentMeta<typeof ReviewSectionComponent>

const Template: ComponentStory<typeof ReviewSectionComponent> = (args) => (
  <ReviewSectionComponent {...args} />
)

export const DisplayingIncome = Template.bind({})
const displayingIncomeSession = getMockSessionData()
displayingIncomeSession.eligibility.adjunctive = ['none']
displayingIncomeSession.income.householdSize = '3'
DisplayingIncome.args = {
  editable: true,
  session: displayingIncomeSession,
}

export const NotDisplayingIncome = Template.bind({})
NotDisplayingIncome.args = {
  editable: true,
  session: getMockSessionData(),
}
