import { Meta, Story } from '@storybook/react'

import {
  StyledLink as StyledLinkComponent,
  StyledLinkProps,
} from '@components/StyledLink'

export default {
  title: 'Components',
  component: StyledLinkComponent,
} as Meta

const Template: Story<StyledLinkProps> = (args) => (
  <StyledLinkComponent {...args} />
)

export const StyledLink = Template.bind({})

StyledLink.args = {
  href: 'test.com',
  textKey: 'link text',
  external: false
}
