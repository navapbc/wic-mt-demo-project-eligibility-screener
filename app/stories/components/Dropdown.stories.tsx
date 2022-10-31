import { ComponentMeta, ComponentStory } from '@storybook/react'

import DropdownComponent from '@components/Dropdown'

export default {
  title: 'Components',
  component: DropdownComponent,
  argTypes: {
    id: {
      control: false,
    },
    handleChange: {
      control: false,
    },
  },
} as ComponentMeta<typeof DropdownComponent>

const Template: ComponentStory<typeof DropdownComponent> = (args) => (
  <DropdownComponent {...args} />
)

export const Dropdown = Template.bind({})

Dropdown.args = {
  id: 'test',
  labelKey: 'Make a selection',
  options: ['1', '2', '3'],
  required: false,
}
