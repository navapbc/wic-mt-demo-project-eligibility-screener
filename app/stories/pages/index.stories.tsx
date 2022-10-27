import { ComponentMeta, ComponentStory } from '@storybook/react'

import IndexPage from '@pages/index'

import { getForwardRoute } from '@utils/routing'

import { getEmptyMockSession } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Index',
  component: IndexPage,
} as ComponentMeta<typeof IndexPage>

const Template: ComponentStory<typeof IndexPage> = (args) => {
  args.forwardRoute = getForwardRoute('/', false, getEmptyMockSession())
  return <IndexPage {...args} />
}

export const Index = Template.bind({})
