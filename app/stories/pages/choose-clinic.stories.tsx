import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import ChooseClinicPage from '@pages/choose-clinic'

import { getBackRoute } from '@utils/routing'

import {
  getEmptyMockSession,
  getMockSessionData,
} from '../../tests/helpers/mockData'

export default {
  title: 'Pages/ChooseClinic',
  component: ChooseClinicPage,
  argTypes: {
    session: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof ChooseClinicPage>

const Template: ComponentStory<typeof ChooseClinicPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  args.backRoute = getBackRoute('/choose-clinic', session)
  return <ChooseClinicPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: getEmptyMockSession(),
}
Default.parameters = {
  nextRouter: {
    path: '/choose-clinic',
  },
}

export const Update = Template.bind({})
Update.args = {
  session: getMockSessionData(),
}
Update.parameters = {
  nextRouter: {
    path: '/choose-clinic',
    asPath: '/choose-clinic?mode=review',
    query: {
      mode: 'review',
    },
  },
}
