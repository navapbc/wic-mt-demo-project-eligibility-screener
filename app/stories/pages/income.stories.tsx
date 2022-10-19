import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import IncomePage from '@pages/income'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Income',
  component: IncomePage,
} as ComponentMeta<typeof IncomePage>

const Template: ComponentStory<typeof IncomePage> = (args) => {
  const [session, setSession] = useArgs()
  return <IncomePage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: cloneDeep(initialSessionData),
}
Default.parameters = {
  nextRouter: {
    path: '/income',
  },
}

let mockSession = fillMockSessionData(cloneDeep(initialSessionData))
mockSession.income.householdSize = '4'

export const Update = Template.bind({})
Update.args = {
  session: mockSession,
}
Update.parameters = {
  nextRouter: {
    path: '/income',
    asPath: '/income?mode=review',
    query: {
      mode: 'review',
    },
  },
}
