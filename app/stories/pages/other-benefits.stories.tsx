import { ComponentMeta, ComponentStory } from '@storybook/react'

import OtherBenefitsPage from '@pages/other-benefits'

export default {
  title: 'Pages/Other Benefits',
  component: OtherBenefitsPage,
} as ComponentMeta<typeof OtherBenefitsPage>

const Template: ComponentStory<typeof OtherBenefitsPage> = (args) => (
  <OtherBenefitsPage {...args} />
)

export const OtherBenefits = Template.bind({})
