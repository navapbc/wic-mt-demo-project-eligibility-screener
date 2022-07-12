import { ComponentMeta, ComponentStory } from '@storybook/react'

import InformationPage from '@pages/information'

export default {
  title: 'Pages',
  component: InformationPage
} as ComponentMeta<typeof InformationPage>

const Template: ComponentStory<typeof InformationPage> = () => (
  <InformationPage />
)

export const Information = Template.bind({})
