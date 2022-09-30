import { ComponentMeta, ComponentStory } from '@storybook/react'

import OtherBenefitsPage from '@pages/other-benefits'

export default {
  title: 'Pages',
  component: OtherBenefitsPage,
} as ComponentMeta<typeof OtherBenefitsPage>

const Template: ComponentStory<typeof OtherBenefitsPage> = () => <OtherBenefitsPage />

export const OtherBenefits = Template.bind({})
