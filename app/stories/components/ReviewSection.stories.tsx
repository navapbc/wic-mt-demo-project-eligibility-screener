import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import ReviewSectionComponent from '@components/ReviewSection'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Components/ReviewSection',
  component: ReviewSectionComponent,
} as ComponentMeta<typeof ReviewSectionComponent>

const Template: ComponentStory<typeof ReviewSectionComponent> = (args) => (
  <ReviewSectionComponent {...args} />
)

export const DisplayingIncome = Template.bind({})
const displayingIncomeSession = fillMockSessionData(
  cloneDeep(initialSessionData)
)
displayingIncomeSession.eligibility.adjunctive = ['none']
displayingIncomeSession.income.householdSize = '3'
DisplayingIncome.args = {
  editable: true,
  session: displayingIncomeSession,
}

export const NotDisplayingIncome = Template.bind({})
NotDisplayingIncome.args = {
  editable: true,
  session: fillMockSessionData(initialSessionData),
}
