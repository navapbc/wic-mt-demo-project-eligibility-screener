import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import EligibilityPage from '@pages/eligibility'

import { getBackRoute } from '@utils/routing'
import { initialSessionData } from '@utils/sessionData'

import { getMockSessionData } from '../../tests/helpers/mockData'

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
  return <EligibilityPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: cloneDeep(initialSessionData),
}
Default.parameters = {
  nextRouter: {
    path: '/eligibility',
  },
}

export const Update = Template.bind({})
Update.args = {
  session: getMockSessionData(),
}
Update.parameters = {
  nextRouter: {
    path: '/eligibility',
    asPath: '/eligibility?mode=review',
    query: {
      mode: 'review',
    },
  },
}
