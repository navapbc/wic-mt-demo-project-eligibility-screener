import { ComponentMeta, ComponentStory } from '@storybook/react'

import RoutingErrorComponent from '@components/RoutingError'

export default {
  title: 'Components',
  component: RoutingErrorComponent,
} as ComponentMeta<typeof RoutingErrorComponent>

const Template: ComponentStory<typeof RoutingErrorComponent> = () => (
  <RoutingErrorComponent />
)

export const RoutingError = Template.bind({})
