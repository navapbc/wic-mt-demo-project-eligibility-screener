import { useArgs } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import ContactPage from '@pages/contact'

import { initialSessionData } from '@utils/sessionData'

import { fillMockSessionData } from '../../tests/helpers/mockData'

export default {
  title: 'Pages/Contact',
  component: ContactPage,
} as ComponentMeta<typeof ContactPage>

const Template: ComponentStory<typeof ContactPage> = (args) => {
  const [session, setSession] = useArgs()
  return <ContactPage {...args} />
}

export const Default = Template.bind({})
Default.args = {
  session: cloneDeep(initialSessionData),
}
Default.parameters = {
  nextRouter: {
    path: '/contact',
  },
}

export const Update = Template.bind({})
Update.args = {
  session: fillMockSessionData(cloneDeep(initialSessionData)),
}
Update.parameters = {
  nextRouter: {
    path: '/contact',
    asPath: '/contact?mode=review',
    query: {
      mode: 'review',
    },
  },
}
