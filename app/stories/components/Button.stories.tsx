import { ComponentMeta, ComponentStory } from '@storybook/react'

import ButtonComponent from '@components/Button'

const styleOptions = [
  'default',
  'unstyled',
  'secondary',
  'accent-cool',
  'accent-warm',
  'base',
  'outline',
  'big',
]

export default {
  title: 'Components',
  component: ButtonComponent,
  argTypes: {
    style: {
      control: 'select',
      options: styleOptions,
    },
  },
} as ComponentMeta<typeof ButtonComponent>

const Template: ComponentStory<typeof ButtonComponent> = (args) => (
  <ButtonComponent {...args} />
)

export const Button = Template.bind({})

Button.args = {
  disabled: false,
  labelKey: 'Button label',
  style: 'unstyled',
}
