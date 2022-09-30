import { ComponentMeta, ComponentStory } from '@storybook/react'

import HowItWorksPage from '@pages/how-it-works'

export default {
  title: 'Pages',
  component: HowItWorksPage,
} as ComponentMeta<typeof HowItWorksPage>

const Template: ComponentStory<typeof HowItWorksPage> = () => (
  <HowItWorksPage />
)

export const HowItWorks = Template.bind({})
