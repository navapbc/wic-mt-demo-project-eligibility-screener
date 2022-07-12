import { ComponentMeta, ComponentStory } from '@storybook/react'

import EligibilityPage from '@pages/eligibility'

export default {
  title: 'Pages',
  component: EligibilityPage
} as ComponentMeta<typeof EligibilityPage>

const Template: ComponentStory<typeof EligibilityPage> = () => (
  <EligibilityPage />
)

export const Eligibility = Template.bind({})
