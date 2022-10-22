import { ComponentMeta, ComponentStory } from '@storybook/react'

import ReviewPage from '@pages/review'

import { getBackRoute, getForwardRoute } from '@utils/routing'

import { getMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Review',
  component: ReviewPage,
} as ComponentMeta<typeof ReviewPage>

const Template: ComponentStory<typeof ReviewPage> = (args) => {
  args.backRoute = getBackRoute('/review', args.session)
  args.forwardRoute = getForwardRoute('/review', false, args.session)
  return <ReviewPage {...args} />
}

export const Review = Template.bind({})
Review.args = {
  session: getMockSessionData(),
}
Review.parameters = {
  nextRouter: {
    path: '/review',
  },
}
