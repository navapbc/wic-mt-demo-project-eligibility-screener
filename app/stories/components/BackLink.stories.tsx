import { ComponentMeta, ComponentStory } from '@storybook/react'

import BackLinkComponent from '@components/BackLink'

export default {
  title: 'Components',
  component: BackLinkComponent,
} as ComponentMeta<typeof BackLinkComponent>

const Template: ComponentStory<typeof BackLinkComponent> = (args) => (
  <BackLinkComponent {...args} />
)

export const BackLink = Template.bind({})

BackLink.args = {
  href: '/internal-route',
}
