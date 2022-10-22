import { ComponentMeta, ComponentStory } from '@storybook/react'

import HowItWorksPage from '@pages/how-it-works'

import { getBackRoute, getForwardRoute } from '@utils/routing'

import { getEmptyMockSession } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/How It Works',
  component: HowItWorksPage,
} as ComponentMeta<typeof HowItWorksPage>

const Template: ComponentStory<typeof HowItWorksPage> = (args) => {
  args.backRoute = getBackRoute('/how-it-works', getEmptyMockSession())
  args.forwardRoute = getForwardRoute(
    '/how-it-works',
    false,
    getEmptyMockSession()
  )
  return <HowItWorksPage {...args} />
}

export const HowItWorks = Template.bind({})
