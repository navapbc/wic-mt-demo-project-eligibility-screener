import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import EligibilityPage from '@pages/eligibility'

import { getEmptyMockSession, getMockSessionData } from '@lib/mockData'
import { getBackRoute, getForwardRoute } from '@utils/routing'

export default {
  title: 'Pages/Eligibility',
  component: EligibilityPage,
  argTypes: {
    session: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof EligibilityPage>

const Template: ComponentStory<typeof EligibilityPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  args.backRoute = getBackRoute('/eligibility', session)
  const reviewMode = args.reviewMode === undefined ? false : args.reviewMode
  args.forwardRoute = getForwardRoute('/eligibility', reviewMode, session)
  return <EligibilityPage {...args} />
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
