import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import ReviewPage from '@pages/review'

import { getMockSessionData } from '@lib/mockData'
import { getBackRoute, getForwardRoute } from '@utils/routing'

export default {
  title: 'Pages/Review',
  component: ReviewPage,
} as ComponentMeta<typeof ReviewPage>

const Template: ComponentStory<typeof ReviewPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
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
