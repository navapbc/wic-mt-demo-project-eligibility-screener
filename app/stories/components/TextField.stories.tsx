import { ComponentMeta, ComponentStory } from '@storybook/react'

import TextFieldComponent from '@components/TextField'

export default {
  title: 'Components',
  component: TextFieldComponent,
  argTypes: {
    id: {
      control: false,
    },
    type: {
      control: 'radio',
      options: ['input', 'textarea'],
    },
  },
} as ComponentMeta<typeof TextFieldComponent>

const Template: ComponentStory<typeof TextFieldComponent> = (args) => (
  <TextFieldComponent {...args} />
)

export const TextField = Template.bind({})

TextField.args = {
  id: 'field-a',
  labelKey: 'Text Input',
  required: true,
  type: 'input',
}
