import { useState } from '@storybook/client-api'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import OtherBenefitsPage from '@pages/other-benefits'

import { getBackRoute, getForwardRoute } from '@utils/routing'

export default {
  title: 'Pages/Other Benefits',
  component: OtherBenefitsPage,
  argTypes: {
    session: {
      table: {
        disable: true,
      },
    },
  },
} as ComponentMeta<typeof OtherBenefitsPage>

const Template: ComponentStory<typeof OtherBenefitsPage> = (args) => {
  const [session, setSession] = useState(args.session)
  args.session = session
  args.setSession = setSession
  args.backRoute = getBackRoute('/other-benefits', session)
  args.forwardRoute = getForwardRoute('/other-benefits', false, session)
  return <OtherBenefitsPage {...args} />
}

export const OtherBenefits = Template.bind({})
