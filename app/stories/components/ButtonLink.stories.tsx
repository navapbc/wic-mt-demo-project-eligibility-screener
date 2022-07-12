import { ComponentMeta, ComponentStory } from '@storybook/react'

import ButtonLinkComponent from '@components/ButtonLink'

export default {
  title: 'Components',
  component: ButtonLinkComponent
} as ComponentMeta<typeof ButtonLinkComponent>

const Template: ComponentStory<typeof ButtonLinkComponent> = (args) => (
  <ButtonLinkComponent {...args} />
)

export const ButtonLink = Template.bind({})

ButtonLink.args = {
  href: '/test',
  label: 'Primary',
  vector: true,
  width: '130px'
}
