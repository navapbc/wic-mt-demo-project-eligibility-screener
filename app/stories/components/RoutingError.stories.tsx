import { Meta, Story } from '@storybook/react'

import { RoutingError as RoutingErrorComponent } from '@components/RoutingError'

export default {
  title: 'Components',
  component: RoutingErrorComponent,
} as Meta

const Template: Story = (args) => <RoutingErrorComponent {...args} />

export const RoutingError = Template.bind({})
