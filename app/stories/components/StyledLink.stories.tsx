import { ComponentMeta, ComponentStory } from '@storybook/react'

import StyledLinkComponent from '@components/StyledLink'

export default {
  title: 'Components',
  component: StyledLinkComponent,
} as ComponentMeta<typeof StyledLinkComponent>

const Template: ComponentStory<typeof StyledLinkComponent> = (args) => (
  <StyledLinkComponent {...args} />
)

export const StyledLink = Template.bind({})

StyledLink.args = {
  href: 'test.com',
  textKey: 'link text',
  external: false,
}
