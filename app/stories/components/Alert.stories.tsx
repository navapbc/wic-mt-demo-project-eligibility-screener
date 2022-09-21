import { ComponentMeta, ComponentStory } from '@storybook/react'

import AlertComponent from '@components/Alert'

export default {
  title: 'Components',
  component: AlertComponent,
} as ComponentMeta<typeof AlertComponent>

const Template: ComponentStory<typeof AlertComponent> = (args) => (
  <AlertComponent {...args} />
)

export const Alert = Template.bind({})

Alert.args = {
  text: 'This is an Alert!',
  type: 'info',
}
