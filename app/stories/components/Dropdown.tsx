import { ComponentMeta, ComponentStory } from '@storybook/react'

import DropdownComponent from '@components/Dropdown'

export default {
  title: 'Components',
  component: DropdownComponent,
} as ComponentMeta<typeof DropdownComponent>

const Template: ComponentStory<typeof DropdownComponent> = (args) => (
  <DropdownComponent {...args} />
)

export const Dropdown = Template.bind({})

Dropdown.args = {
  id: 'test',
  label: 'Select',
  options: ['1', '2', '3'],
}
