import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import ChooseClinicPage from '@pages/choose-clinic'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

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
  return <ChooseClinicPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: cloneDeep(initialSessionData),
}
Default.parameters = {
  nextRouter: {
    path: '/choose-clinic',
  },
}

export const Update = Template.bind({})
Update.args = {
  session: fillMockSessionData(cloneDeep(initialSessionData)),
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
