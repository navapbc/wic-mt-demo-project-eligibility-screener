import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ContactPage from '@pages/contact'

import { getEmptyMockSession, getMockSessionData } from '@lib/mockData'
import { getBackRoute, getForwardRoute } from '@utils/routing'

export default {
  title: 'Pages/Contact',
  component: ContactPage,
  argTypes: {
    session: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ContactPage>

const Template: ComponentStory<typeof ContactPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  args.backRoute = getBackRoute('/contact', session)
  const reviewMode = args.reviewMode === undefined ? false : args.reviewMode
  args.forwardRoute = getForwardRoute('/contact', reviewMode, session)
  return <ContactPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: getEmptyMockSession(),
}

export const Update = Template.bind({})
Update.args = {
  session: getMockSessionData(),
  reviewMode: true,
}
