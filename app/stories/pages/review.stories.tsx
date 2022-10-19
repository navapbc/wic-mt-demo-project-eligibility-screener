import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import ReviewPage from '@pages/review'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Review',
  component: ReviewPage,
} as ComponentMeta<typeof ReviewPage>

const Template: ComponentStory<typeof ReviewPage> = (args) => {
  return <ReviewPage {...args} />
}

export const Review = Template.bind({})
Review.args = {
  session: fillMockSessionData(cloneDeep(initialSessionData)),
}
Review.parameters = {
  nextRouter: {
    path: '/review',
  },
}
