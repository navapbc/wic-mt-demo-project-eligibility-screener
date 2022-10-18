import { Meta, Story } from '@storybook/react'

import {
  BackLink as BackLinkComponent,
  BackLinkProps,
} from '@components/BackLink'

export default {
  title: 'Components',
  component: BackLinkComponent,
} as Meta

const Template: Story<BackLinkProps> = (args) => <BackLinkComponent {...args} />

export const BackLink = Template.bind({})

BackLink.args = {
  href: '/internal-route',
}
