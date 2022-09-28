import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextAreaComponent from '@components/TextArea'

export default {
  title: 'Components',
  component: TextAreaComponent,
} as ComponentMeta<typeof TextAreaComponent>

const Template: ComponentStory<typeof TextAreaComponent> = (args) => (
  <TextAreaComponent {...args} />
)

export const TextArea = Template.bind({})

TextArea.args = {
  label: 'Text Input',
  required: true,
}
