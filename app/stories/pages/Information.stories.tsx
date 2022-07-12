import { ComponentMeta, ComponentStory } from '@storybook/react'

import InformationPage from '../../src/pages/information'

export default {
  title: 'Pages',
  component: InformationPage,
} as ComponentMeta<typeof InformationPage>

const Template: ComponentStory<typeof InformationPage> = () => <InformationPage />

export const Information = Template.bind({})
