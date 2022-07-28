import { ComponentMeta, ComponentStory } from '@storybook/react'

import IndexPage from '@pages/index'

export default {
  title: 'Pages',
  component: IndexPage,
} as ComponentMeta<typeof IndexPage>

const Template: ComponentStory<typeof IndexPage> = () => <IndexPage />

export const Index = Template.bind({})
