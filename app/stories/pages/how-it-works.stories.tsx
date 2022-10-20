import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import HowItWorksPage from '@pages/how-it-works'

import { getBackRoute } from '@utils/routing'
import { initialSessionData } from '@utils/sessionData'

export default {
  title: 'Pages/How It Works',
  component: HowItWorksPage,
} as ComponentMeta<typeof HowItWorksPage>

const Template: ComponentStory<typeof HowItWorksPage> = (args) => {
  args.backRoute = getBackRoute('/how-it-works', cloneDeep(initialSessionData))
  return <HowItWorksPage {...args} />
}

export const HowItWorks = Template.bind({})
