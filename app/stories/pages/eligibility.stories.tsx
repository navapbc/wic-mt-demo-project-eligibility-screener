import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import EligibilityPage from '@pages/eligibility'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Eligibility',
  component: EligibilityPage,
} as ComponentMeta<typeof EligibilityPage>

const Template: ComponentStory<typeof EligibilityPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  return <EligibilityPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: fillMockSessionData(initialSessionData),
}
Default.parameters = {
  nextRouter: {
    path: '/eligibility',
  },
}

export const Review = Template.bind({})
Review.args = {
  session: fillMockSessionData(initialSessionData),
}
Review.parameters = {
  nextRouter: {
    path: '/eligibility',
    asPath: '/eligibility?mode=review',
    query: {
      mode: 'review',
    },
  },
}
