import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import ConfirmationPage from '@pages/confirmation'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Confirmation',
  component: ConfirmationPage,
} as ComponentMeta<typeof ConfirmationPage>

const Template: ComponentStory<typeof ConfirmationPage> = (args) => {
  const [session, setSession] = useArgs()
  return <ConfirmationPage {...args} />
}

export const Confirmation = Template.bind({})
Confirmation.args = {
  session: fillMockSessionData(cloneDeep(initialSessionData)),
}
Confirmation.parameters = {
  nextRouter: {
    path: '/confirmation',
  },
}
