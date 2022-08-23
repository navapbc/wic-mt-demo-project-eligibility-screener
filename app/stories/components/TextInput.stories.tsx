import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextInputComponent from '@components/TextInput'

export default {
  title: 'Components',
  component: TextInputComponent,
} as ComponentMeta<typeof TextInputComponent>

const Template: ComponentStory<typeof TextInputComponent> = (args) => (
  <TextInputComponent {...args} />
)

export const TextInput = Template.bind({})

TextInput.args = {
  label: 'Text Input',
  required: true,
}
