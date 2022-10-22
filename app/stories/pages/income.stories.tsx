import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import IncomePage from '@pages/income'

import { getBackRoute } from '@utils/routing'

import {
  getEmptyMockSession,
  getMockSessionData,
} from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Income',
  component: IncomePage,
  argTypes: {
    session: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof IncomePage>

const Template: ComponentStory<typeof IncomePage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  args.backRoute = getBackRoute('/income', session)
  return <IncomePage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: getEmptyMockSession(),
}

let mockSession = getMockSessionData()
mockSession.income.householdSize = '4'

export const Update = Template.bind({})
Update.args = {
  session: mockSession,
  reviewMode: true,
}
